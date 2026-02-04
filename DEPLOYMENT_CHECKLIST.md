# RentBy Deployment Checklist

Quick reference checklist for deploying RentBy to production.

## Pre-Deployment

- [x] Smart contracts built and tested
- [x] API built and tested
- [x] Frontend built and tested
- [x] SSH public key added to GitHub
- [x] Code pushed to GitHub (all 29 commits)
- [x] Deployment configs created (Railway, Heroku, Vercel)
- [x] Environment variable templates created
- [x] Comprehensive deployment guide written

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

**Current Status:** ✅ Code pushed to GitHub. Ready for deployment!

**Next Immediate Steps:**
1. Deploy smart contract to Solana devnet (see `docs/DEPLOYMENT.md`)
2. Deploy API to Railway (zero-config, auto-deploy from GitHub)
3. Deploy frontend to Vercel (auto-detects Next.js)

**Quick Start:**
```bash
# Deploy smart contract
cd /root/.openclaw/workspace/rentby
anchor build && anchor deploy

# Set up Railway (API)
1. Visit https://railway.app
2. New Project → Deploy from GitHub → Select 'rentby'
3. Set root directory: 'api'
4. Add environment variables (see api/.env.example)

# Set up Vercel (Frontend)
1. Visit https://vercel.com
2. New Project → Import 'rentby' repository
3. Set root directory: 'frontend'
4. Add environment variables (see frontend/.env.example)
```

See `docs/DEPLOYMENT.md` for detailed step-by-step instructions.
