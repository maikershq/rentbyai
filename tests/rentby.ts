import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Rentby } from "../target/types/rentby";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";
import { assert } from "chai";

describe("rentby", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Rentby as Program<Rentby>;
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;

  let resourceMint: anchor.web3.PublicKey;
  let ownerTokenAccount: anchor.web3.PublicKey;
  let renterTokenAccount: anchor.web3.PublicKey;
  let resourceAccount: anchor.web3.PublicKey;
  let rentalAccount: anchor.web3.PublicKey;
  let escrowTokenAccount: anchor.web3.PublicKey;
  let escrowAuthority: anchor.web3.PublicKey;

  const resourceOwner = wallet.publicKey;
  const renter = anchor.web3.Keypair.generate();

  const resourceType = "compute";
  const resourceSpecs = "4x NVIDIA A100 80GB";
  const hourlyRate = 5_000_000; // 5 USDC (assuming 6 decimals)

  before(async () => {
    // Airdrop SOL to renter
    const airdropSignature = await connection.requestAirdrop(
      renter.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);

    // Create a new token mint for the resource
    resourceMint = await createMint(
      connection,
      wallet.payer,
      wallet.publicKey,
      null,
      6
    );

    // Create token accounts for resource owner and renter
    ownerTokenAccount = await createAccount(
      connection,
      wallet.payer,
      resourceMint,
      resourceOwner
    );

    renterTokenAccount = await createAccount(
      connection,
      wallet.payer,
      resourceMint,
      renter.publicKey
    );

    // Mint tokens to renter
    await mintTo(
      connection,
      wallet.payer,
      resourceMint,
      renterTokenAccount,
      wallet.publicKey,
      100_000_000 // 100 tokens
    );
  });

  it("Creates a new resource", async () => {
    // Derive resource PDA
    [resourceAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("resource"), resourceMint.toBuffer()],
      program.programId
    );

    // Create resource
    const tx = await program.methods
      .createResource(resourceType, resourceSpecs, new anchor.BN(hourlyRate))
      .accounts({
        resource: resourceAccount,
        mint: resourceMint,
        owner: resourceOwner,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("Create resource transaction:", tx);

    // Fetch and verify resource account
    const resource = await program.account.resource.fetch(resourceAccount);

    assert.equal(resource.owner.toString(), resourceOwner.toString());
    assert.equal(resource.mint.toString(), resourceMint.toString());
    assert.equal(resource.resourceType, resourceType);
    assert.equal(resource.specs, resourceSpecs);
    assert.equal(resource.hourlyRate.toNumber(), hourlyRate);
    assert.equal(resource.reputation.toNumber(), 0);
    assert.equal(resource.totalRentals.toNumber(), 0);
  });

  it("Creates a rental agreement with escrow", async () => {
    const amount = new anchor.BN(25_000_000); // 25 tokens (5 hours at 5 tokens/hour)
    const duration = new anchor.BN(3600); // 1 hour

    // Derive rental PDA
    [rentalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("rental"), renter.publicKey.toBuffer(), resourceMint.toBuffer()],
      program.programId
    );

    // Derive escrow authority and token account
    [escrowAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), rentalAccount.toBuffer()],
      program.programId
    );

    escrowTokenAccount = await createAccount(
      connection,
      wallet.payer,
      resourceMint,
      escrowAuthority
    );

    // Create rental
    const tx = await program.methods
      .createRental(amount, duration)
      .accounts({
        rental: rentalAccount,
        escrowTokenAccount: escrowTokenAccount,
        escrowAuthority: escrowAuthority,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
        resourceMint: resourceMint,
        renterTokenAccount: renterTokenAccount,
        ownerTokenAccount: ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([renter])
      .rpc();

    console.log("Create rental transaction:", tx);

    // Fetch and verify rental account
    const rental = await program.account.rentalAgreement.fetch(rentalAccount);

    assert.equal(rental.renter.toString(), renter.publicKey.toString());
    assert.equal(
      rental.resourceOwner.toString(),
      resourceOwner.toString()
    );
    assert.equal(
      rental.resourceMint.toString(),
      resourceMint.toString()
    );
    assert.equal(rental.escrowAmount.toNumber(), amount.toNumber());
    assert.equal(rental.status.active, true); // Active status

    // Verify escrow balance
    const escrowBalance = await connection.getTokenAccountBalance(
      escrowTokenAccount
    );
    assert.equal(escrowBalance.value.amount, amount.toString());
  });

  it("Completes a rental and releases escrow", async () => {
    // Get initial owner balance
    const ownerBalanceBefore = await connection.getTokenAccountBalance(
      ownerTokenAccount
    );

    // Complete rental (can be called by renter or owner)
    const tx = await program.methods
      .completeRental()
      .accounts({
        rental: rentalAccount,
        escrowTokenAccount: escrowTokenAccount,
        escrowAuthority: escrowAuthority,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
        resourceAccount: resourceAccount,
        ownerTokenAccount: ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([renter])
      .rpc();

    console.log("Complete rental transaction:", tx);

    // Fetch and verify rental status
    const rental = await program.account.rentalAgreement.fetch(rentalAccount);
    assert.equal(rental.status.completed, true);

    // Fetch and verify resource reputation increased
    const resource = await program.account.resource.fetch(resourceAccount);
    assert.equal(resource.reputation.toNumber(), 1);
    assert.equal(resource.totalRentals.toNumber(), 1);

    // Verify escrow released to owner
    const ownerBalanceAfter = await connection.getTokenAccountBalance(
      ownerTokenAccount
    );
    const ownerBalanceDiff =
      parseInt(ownerBalanceAfter.value.amount) -
      parseInt(ownerBalanceBefore.value.amount);
    assert.equal(ownerBalanceDiff, rental.escrowAmount.toNumber());
  });

  it("Creates and disputes a rental", async () => {
    const amount = new anchor.BN(10_000_000); // 10 tokens
    const duration = new anchor.BN(1800); // 30 minutes

    // Create new rental for dispute test
    [rentalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("rental"), renter.publicKey.toBuffer(), resourceMint.toBuffer()],
      program.programId
    );

    [escrowAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), rentalAccount.toBuffer()],
      program.programId
    );

    escrowTokenAccount = await createAccount(
      connection,
      wallet.payer,
      resourceMint,
      escrowAuthority
    );

    // Create rental
    await program.methods
      .createRental(amount, duration)
      .accounts({
        rental: rentalAccount,
        escrowTokenAccount: escrowTokenAccount,
        escrowAuthority: escrowAuthority,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
        resourceMint: resourceMint,
        renterTokenAccount: renterTokenAccount,
        ownerTokenAccount: ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([renter])
      .rpc();

    // Dispute rental
    const tx = await program.methods
      .disputeRental()
      .accounts({
        rental: rentalAccount,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
      })
      .signers([renter])
      .rpc();

    console.log("Dispute rental transaction:", tx);

    // Verify disputed status
    const rental = await program.account.rentalAgreement.fetch(rentalAccount);
    assert.equal(rental.status.disputed, true);
  });

  it("Resolves dispute by refunding to renter", async () => {
    const renterBalanceBefore = await connection.getTokenAccountBalance(
      renterTokenAccount
    );

    const resourceBefore = await program.account.resource.fetch(resourceAccount);

    // Resolve dispute with refund
    const tx = await program.methods
      .resolveDispute(true) // true = refund to renter
      .accounts({
        rental: rentalAccount,
        escrowTokenAccount: escrowTokenAccount,
        escrowAuthority: escrowAuthority,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
        resourceAccount: resourceAccount,
        renterTokenAccount: renterTokenAccount,
        ownerTokenAccount: ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([renter])
      .rpc();

    console.log("Resolve dispute (refund) transaction:", tx);

    // Verify resolved status
    const rental = await program.account.rentalAgreement.fetch(rentalAccount);
    assert.equal(rental.status.resolved, true);

    // Verify resource reputation decreased
    const resourceAfter = await program.account.resource.fetch(resourceAccount);
    assert.equal(
      resourceAfter.reputation.toNumber(),
      resourceBefore.reputation.toNumber() - 1
    );

    // Verify refund to renter
    const renterBalanceAfter = await connection.getTokenAccountBalance(
      renterTokenAccount
    );
    const renterBalanceDiff =
      parseInt(renterBalanceAfter.value.amount) -
      parseInt(renterBalanceBefore.value.amount);
    assert.equal(renterBalanceDiff, rental.escrowAmount.toNumber());
  });

  it("Resolves dispute by paying owner", async () => {
    const amount = new anchor.BN(10_000_000);
    const duration = new anchor.BN(1800);

    // Create new rental
    [rentalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("rental"), renter.publicKey.toBuffer(), resourceMint.toBuffer()],
      program.programId
    );

    [escrowAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), rentalAccount.toBuffer()],
      program.programId
    );

    escrowTokenAccount = await createAccount(
      connection,
      wallet.payer,
      resourceMint,
      escrowAuthority
    );

    await program.methods
      .createRental(amount, duration)
      .accounts({
        rental: rentalAccount,
        escrowTokenAccount: escrowTokenAccount,
        escrowAuthority: escrowAuthority,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
        resourceMint: resourceMint,
        renterTokenAccount: renterTokenAccount,
        ownerTokenAccount: ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([renter])
      .rpc();

    await program.methods
      .disputeRental()
      .accounts({
        rental: rentalAccount,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
      })
      .signers([renter])
      .rpc();

    const resourceBefore = await program.account.resource.fetch(resourceAccount);

    // Resolve dispute with payment to owner
    const tx = await program.methods
      .resolveDispute(false) // false = pay owner
      .accounts({
        rental: rentalAccount,
        escrowTokenAccount: escrowTokenAccount,
        escrowAuthority: escrowAuthority,
        renter: renter.publicKey,
        resourceOwner: resourceOwner,
        resourceAccount: resourceAccount,
        renterTokenAccount: renterTokenAccount,
        ownerTokenAccount: ownerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([renter])
      .rpc();

    console.log("Resolve dispute (pay owner) transaction:", tx);

    // Verify resource reputation increased
    const resourceAfter = await program.account.resource.fetch(resourceAccount);
    assert.equal(
      resourceAfter.reputation.toNumber(),
      resourceBefore.reputation.toNumber() + 1
    );
  });
});
