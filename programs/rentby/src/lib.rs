use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("94DQFAXh6sNHQPPzYCCANhSPvznuQch8j18WuiijRb3L");

#[program]
pub mod rentby {
    use super::*;

    /// Create a new rental agreement between a renter and a resource owner
    /// Funds are locked in escrow until task completion
    pub fn create_rental(
        ctx: Context<CreateRental>,
        amount: u64,
        duration: u64,
    ) -> Result<()> {
        let rental = &mut ctx.accounts.rental;
        let clock = Clock::get()?;

        rental.renter = ctx.accounts.renter.key();
        rental.resource_owner = ctx.accounts.resource_owner.key();
        rental.resource_mint = ctx.accounts.resource_mint.key();
        rental.escrow_amount = amount;
        rental.start_time = clock.unix_timestamp;
        rental.duration = duration as i64;
        rental.status = RentalStatus::Active;

        // Transfer funds from renter to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.renter_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.renter.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        msg!("Rental created: {} for {} tokens", rental.key(), amount);
        Ok(())
    }

    /// Complete a rental and release escrow funds to resource owner
    pub fn complete_rental(ctx: Context<CompleteRental>) -> Result<()> {
        let rental = &mut ctx.accounts.rental;

        require!(rental.status == RentalStatus::Active, ErrorCode::NotActive);
        require!(
            ctx.accounts.renter.key() == rental.renter
                || ctx.accounts.resource_owner.key() == rental.resource_owner,
            ErrorCode::Unauthorized
        );

        rental.status = RentalStatus::Completed;

        // Update reputation
        let resource = &mut ctx.accounts.resource_account;
        resource.reputation += 1;
        resource.total_rentals += 1;

        // Release escrow to resource owner
        let rental_key = rental.key();
        let (_escrow_authority, escrow_bump) = Pubkey::find_program_address(
            &[b"escrow", rental_key.as_ref()],
            ctx.program_id,
        );
        let seeds = &[
            b"escrow",
            rental_key.as_ref(),
            &[escrow_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.owner_token_account.to_account_info(),
            authority: ctx.accounts.escrow_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, rental.escrow_amount)?;

        msg!("Rental completed: {}", rental.key());
        Ok(())
    }

    /// Dispute a rental - funds are held pending resolution
    /// Can be escalated to human arbitration
    pub fn dispute_rental(ctx: Context<DisputeRental>) -> Result<()> {
        let rental = &mut ctx.accounts.rental;

        require!(rental.status == RentalStatus::Active, ErrorCode::NotActive);
        require!(
            ctx.accounts.renter.key() == rental.renter
                || ctx.accounts.resource_owner.key() == rental.resource_owner,
            ErrorCode::Unauthorized
        );

        rental.status = RentalStatus::Disputed;

        msg!("Rental disputed: {}", rental.key());
        Ok(())
    }

    /// Resolve a dispute - release funds to renter (refund) or owner (payment)
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        refund_to_renter: bool,
    ) -> Result<()> {
        let rental = &mut ctx.accounts.rental;

        require!(rental.status == RentalStatus::Disputed, ErrorCode::NotDisputed);
        require!(
            ctx.accounts.renter.key() == rental.renter
                || ctx.accounts.resource_owner.key() == rental.resource_owner,
            ErrorCode::Unauthorized
        );

        let rental_key = rental.key();
        let (_escrow_authority, escrow_bump) = Pubkey::find_program_address(
            &[b"escrow", rental_key.as_ref()],
            ctx.program_id,
        );
        let seeds = &[
            b"escrow",
            rental_key.as_ref(),
            &[escrow_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        if refund_to_renter {
            // Refund to renter
            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.renter_token_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
            token::transfer(cpi_ctx, rental.escrow_amount)?;

            // Penalize resource reputation
            let resource = &mut ctx.accounts.resource_account;
            resource.reputation = resource.reputation.saturating_sub(1);
        } else {
            // Release to owner
            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.owner_token_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
            token::transfer(cpi_ctx, rental.escrow_amount)?;

            // Boost resource reputation
            let resource = &mut ctx.accounts.resource_account;
            resource.reputation += 1;
            resource.total_rentals += 1;
        }

        rental.status = RentalStatus::Resolved;
        msg!("Dispute resolved: {}", rental.key());
        Ok(())
    }

    /// Create a new resource NFT
    pub fn create_resource(
        ctx: Context<CreateResource>,
        resource_type: String,
        specs: String,
        hourly_rate: u64,
    ) -> Result<()> {
        let resource = &mut ctx.accounts.resource;
        let clock = Clock::get()?;

        resource.owner = ctx.accounts.owner.key();
        resource.mint = ctx.accounts.mint.key();
        resource.resource_type = resource_type;
        resource.specs = specs;
        resource.hourly_rate = hourly_rate;
        resource.reputation = 0;
        resource.total_rentals = 0;
        resource.created_at = clock.unix_timestamp;

        msg!("Resource created: {} owned by {}", resource.mint, resource.owner);
        Ok(())
    }
}

// ============ Contexts ============

#[derive(Accounts)]
pub struct CreateRental<'info> {
    #[account(
        init,
        payer = renter,
        space = RentalAgreement::LEN,
        seeds = [b"rental", renter.key().as_ref(), resource_mint.key().as_ref()],
        bump
    )]
    pub rental: Account<'info, RentalAgreement>,

    #[account(
        init,
        payer = renter,
        token::mint = resource_mint,
        token::authority = escrow_authority,
        seeds = [b"escrow", rental.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// CHECK: Escrow authority PDA
    #[account(
        seeds = [b"escrow", rental.key().as_ref()],
        bump
    )]
    pub escrow_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub renter: Signer<'info>,

    /// CHECK: Resource owner (not signer)
    pub resource_owner: UncheckedAccount<'info>,

    pub resource_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = renter_token_account.mint == resource_mint.key()
    )]
    pub renter_token_account: Account<'info, TokenAccount>,

    /// CHECK: Owner's token account (will be funded on completion)
    pub owner_token_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CompleteRental<'info> {
    #[account(
        mut,
        seeds = [b"rental", rental.renter.as_ref(), rental.resource_mint.as_ref()],
        bump = rental.bump
    )]
    pub rental: Account<'info, RentalAgreement>,

    #[account(
        mut,
        seeds = [b"escrow", rental.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// CHECK: Escrow authority
    #[account(
        seeds = [b"escrow", rental.key().as_ref()],
        bump
    )]
    pub escrow_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub renter: Signer<'info>,

    /// CHECK: Resource owner (not signer)
    pub resource_owner: UncheckedAccount<'info>,

    #[account(mut)]
    pub resource_account: Account<'info, Resource>,

    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DisputeRental<'info> {
    #[account(
        mut,
        seeds = [b"rental", rental.renter.as_ref(), rental.resource_mint.as_ref()],
        bump = rental.bump
    )]
    pub rental: Account<'info, RentalAgreement>,

    #[account(mut)]
    pub renter: Signer<'info>,

    /// CHECK: Resource owner
    pub resource_owner: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(
        mut,
        seeds = [b"rental", rental.renter.as_ref(), rental.resource_mint.as_ref()],
        bump = rental.bump
    )]
    pub rental: Account<'info, RentalAgreement>,

    #[account(
        mut,
        seeds = [b"escrow", rental.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// CHECK: Escrow authority
    #[account(
        seeds = [b"escrow", rental.key().as_ref()],
        bump
    )]
    pub escrow_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub renter: Signer<'info>,

    /// CHECK: Resource owner
    pub resource_owner: UncheckedAccount<'info>,

    #[account(mut)]
    pub resource_account: Account<'info, Resource>,

    #[account(mut)]
    pub renter_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateResource<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 4 + 50 + 4 + 200 + 8 + 4 + 4 + 8 + 1,
        seeds = [b"resource", mint.key().as_ref()],
        bump
    )]
    pub resource: Account<'info, Resource>,

    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// ============ Accounts ============

#[account]
pub struct RentalAgreement {
    pub renter: Pubkey,
    pub resource_owner: Pubkey,
    pub resource_mint: Pubkey,
    pub escrow_amount: u64,
    pub start_time: i64,
    pub duration: i64,
    pub status: RentalStatus,
    pub bump: u8,
}

impl RentalAgreement {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 8 + 8 + 8 + 1 + 1;
}

#[account]
pub struct Resource {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub resource_type: String,
    pub specs: String,
    pub hourly_rate: u64,
    pub reputation: i32,
    pub total_rentals: u32,
    pub created_at: i64,
    pub bump: u8,
}

// ============ Enums ============

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum RentalStatus {
    Active,
    Completed,
    Disputed,
    Resolved,
}

// ============ Errors ============

#[error_code]
pub enum ErrorCode {
    #[msg("Rental is not active")]
    NotActive,
    #[msg("Rental is not disputed")]
    NotDisputed,
    #[msg("Unauthorized to perform this action")]
    Unauthorized,
}
