# RentBy Deployment Checklist

Quick reference checklist for deploying RentBy to production.

## Pre-Deployment

- [x] Smart contracts built and tested
- [x] API built and tested
- [x] Frontend built and tested
- [ ] **BLOCKER:** Add SSH public key to GitHub
  - Key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINtZcpi4a1prqjfED0+mZvN9+IQNMHlIdDdxgZRJrlAf`
  - Add at: https://github.com/settings/keys
- [ ] Push code to GitHub (`git push`)

## Smart Contract Deployment

- [ ] Install Solana CLI
- [ ] Install Anchor CLI
- [ ] Set up Solana wallet
- [ ] Airdrop SOL to devnet wallet
- [ ] Build program (`anchor build`)
- [ ] Deploy to devnet (`anchor deploy`)
- [ ] Update Program ID in all configs
- [ ] Test on devnet
- [ ] Deploy to mainnet (when ready)

## API Deployment

### Railway (Recommended)
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Set root directory to `/api`
- [ ] Configure environment variables:
  - [ ] `PORT=3000`
  - [ ] `NODE_ENV=production`
  - [ ] `SOLANA_RPC_URL`
  - [ ] `PROGRAM_ID`
  - [ ] `FRONTEND_URL`
- [ ] Deploy and verify
- [ ] Note API URL for frontend config

### Alternative: Heroku
- [ ] Install Heroku CLI
- [ ] Create Heroku app (`heroku create rentby-api`)
- [ ] Set environment variables
- [ ] Push to Heroku
- [ ] Verify deployment

## Frontend Deployment

### Vercel (Recommended)
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Set root directory to `/frontend`
- [ ] Configure environment variables:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_SOLANA_RPC_URL`
  - [ ] `NEXT_PUBLIC_PROGRAM_ID`
- [ ] Deploy and verify
- [ ] Set up custom domain (rentby.ai)

## Domain Configuration

- [ ] Add domain to Vercel
- [ ] Configure DNS records:
  - [ ] A record: @ → 76.76.21.21
  - [ ] CNAME: www → cname.vercel-dns.com
- [ ] Wait for DNS propagation
- [ ] Verify HTTPS working

## Post-Deployment

- [ ] Test wallet connection
- [ ] Create test resource
- [ ] Complete test rental
- [ ] Verify all API endpoints
- [ ] Check smart contract transactions
- [ ] Enable monitoring/analytics
- [ ] Set up error tracking

## Production Checklist

- [ ] Smart contract audited (recommended)
- [ ] Security review completed
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Documentation complete

## Marketing & Launch

- [ ] Create social media accounts
- [ ] Write launch announcement
- [ ] Submit to Solana ecosystem directory
- [ ] Post on relevant forums
- [ ] Create Discord/Telegram community

---

**Current Status:** Waiting for SSH key setup to push to GitHub

**Next Immediate Step:** User needs to add SSH public key to GitHub, then run `git push`

See `docs/DEPLOYMENT.md` for detailed instructions.
