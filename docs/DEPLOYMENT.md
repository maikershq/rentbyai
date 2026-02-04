# RentBy Deployment Guide

Complete guide for deploying RentBy to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Smart Contract Deployment](#smart-contract-deployment)
3. [API Deployment](#api-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Post-Deployment](#post-deployment)
6. [Environment Variables](#environment-variables)

---

## Prerequisites

### Required Accounts
- GitHub account (for code hosting)
- Solana wallet with SOL for deployment (Phantom/Solflare)
- Railway/Heroku account (for API hosting)
- Vercel account (for frontend hosting)
- Domain registrar access (for rentby.ai)

### Required Tools
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Verify installations
solana --version
anchor --version
node --version
```

---

## Smart Contract Deployment

### 1. Build the Program

```bash
cd /root/.openclaw/workspace/rentby
anchor build
```

### 2. Deploy to Devnet (Testing)

```bash
# Set to devnet
solana config set --url https://api.devnet.solana.com

# Airdrop SOL for deployment costs
solana airdrop 2

# Deploy
anchor deploy

# Note the Program ID from output
```

### 3. Update Program ID

Update the Program ID in all files:

**Files to update:**
- `Anchor.toml` - Replace `[programs.devnet]` address
- `api/.env` - Set `PROGRAM_ID=<your_program_id>`
- `frontend/.env.local` - Set `NEXT_PUBLIC_PROGRAM_ID=<your_program_id>`

```bash
# Re-build after updating Program ID
anchor build
```

### 4. Deploy to Mainnet (Production)

```bash
# Set to mainnet
solana config set --url https://api.mainnet-beta.solana.com

# Ensure wallet has enough SOL (~2-5 SOL for deployment)
solana balance

# Deploy to mainnet
anchor deploy

# Update Program ID in all environments
```

### 5. Verify Deployment

```bash
# Check program account
solana program show <PROGRAM_ID>

# Run integration tests
anchor test
```

---

## API Deployment

### Option A: Railway (Recommended)

#### 1. Push to GitHub

```bash
cd /root/.openclaw/workspace/rentby
git push
```

#### 2. Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `rentby` repository
5. Set root directory to `/api`
6. Railway will detect `railway.json` automatically

#### 3. Configure Environment Variables

In Railway dashboard, add these variables:
```
PORT=3000
NODE_ENV=production
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PROGRAM_ID=<your_deployed_program_id>
FRONTEND_URL=https://rentby.ai
```

#### 4. Deploy

Railway will automatically deploy. Monitor logs for any errors.

#### 5. Get API URL

Railway will provide a URL like: `https://rentby-api-production.up.railway.app`

Copy this URL for frontend configuration.

### Option B: Heroku

#### 1. Install Heroku CLI

```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku login
```

#### 2. Create Heroku App

```bash
cd /root/.openclaw/workspace/rentby/api
heroku create rentby-api
```

#### 3. Set Environment Variables

```bash
heroku config:set PORT=3000
heroku config:set NODE_ENV=production
heroku config:set SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
heroku config:set PROGRAM_ID=<your_deployed_program_id>
heroku config:set FRONTEND_URL=https://rentby.ai
```

#### 4. Deploy

```bash
git push heroku main
```

#### 5. Verify

```bash
heroku logs --tail
heroku open
```

### API Health Check

Test your deployed API:
```bash
curl https://your-api-url.com/api/resources
curl https://your-api-url.com/api/stats
```

---

## Frontend Deployment

### 1. Configure Environment Variables

Create `frontend/.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://your-api-url.railway.app
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your_deployed_program_id>
```

### 2. Test Build Locally

```bash
cd /root/.openclaw/workspace/rentby/frontend
npm run build
npm start
# Visit http://localhost:3000 to verify
```

### 3. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /root/.openclaw/workspace/rentby/frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: rentby
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

#### Option B: Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import `rentby` from GitHub
4. Set root directory to `/frontend`
5. Vercel will auto-detect Next.js

#### 4. Configure Environment Variables in Vercel

In Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL = https://your-api-url.railway.app
NEXT_PUBLIC_SOLANA_RPC_URL = https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID = <your_deployed_program_id>
```

#### 5. Redeploy

After adding env vars, trigger a redeploy from Vercel dashboard.

### 4. Custom Domain Setup

#### In Vercel:
1. Go to Settings → Domains
2. Add `rentby.ai`
3. Add `www.rentby.ai`

#### In Domain Registrar:
Add these DNS records:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Wait for DNS propagation (~1-24 hours).

---

## Post-Deployment

### 1. Verify All Services

```bash
# Check API
curl https://api.rentby.ai/api/stats

# Check Frontend
curl https://rentby.ai

# Check Smart Contract
solana program show <PROGRAM_ID>
```

### 2. End-to-End Testing

1. Visit https://rentby.ai
2. Connect wallet (Phantom/Solflare)
3. Create a test resource
4. Make a test rental
5. Complete rental cycle
6. Verify funds transfer

### 3. Monitoring Setup

#### Railway/Heroku:
- Enable application metrics
- Set up log drains (optional)
- Configure alerts for errors

#### Vercel:
- Enable Analytics
- Monitor build performance
- Check error logs

### 4. Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Environment variables secured
- [ ] No secrets in code
- [ ] Smart contract audited (recommended for mainnet)

### 5. Backup Strategy

```bash
# Backup smart contract code
cd /root/.openclaw/workspace/rentby
git tag v1.0.0-production
git push --tags

# Document Program ID and deployment wallet
echo "PROGRAM_ID=<your_id>" >> DEPLOYMENT_RECORD.txt
echo "WALLET=<your_wallet>" >> DEPLOYMENT_RECORD.txt
```

---

## Environment Variables Reference

### API Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `PROGRAM_ID` | Deployed program address | `HGw7...` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://rentby.ai` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API endpoint | `https://api.rentby.ai` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_PROGRAM_ID` | Deployed program address | `HGw7...` |

---

## Troubleshooting

### API Won't Start
```bash
# Check logs
railway logs  # or heroku logs --tail

# Common issues:
# - Missing environment variables
# - Port binding error
# - Node version mismatch
```

### Frontend Build Fails
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing dependencies (run npm install)
# - Environment variables not set
# - API URL incorrect
```

### Smart Contract Errors
```bash
# Check program logs
solana logs <PROGRAM_ID>

# Common issues:
# - Insufficient rent
# - Wrong Program ID in client
# - Account not initialized
```

### Wallet Connection Issues
- Ensure Phantom/Solflare is on correct network (devnet/mainnet)
- Check browser console for errors
- Verify RPC URL is correct

---

## Deployment Costs Estimate

### One-Time Costs:
- Domain registration: ~$10-15/year (rentby.ai)
- Smart contract deployment: ~0.5-2 SOL (~$50-200 depending on SOL price)
- Smart contract rent: ~0.1 SOL (~$10-20)

### Monthly Costs:
- Railway (API): $5-20/month (depends on usage)
- Vercel (Frontend): Free for hobby, $20+/month for pro
- Solana RPC: Free (public nodes) or $50-500/month (private nodes like Helius/QuickNode)

**Total estimated monthly cost:** $5-40 (hobby) or $75-540 (production)

---

## Next Steps After Deployment

1. **Marketing:**
   - Create Twitter/X account (@rentby_ai)
   - Post on /r/solana, /r/solanadev
   - Write launch blog post
   - Submit to Solana ecosystem directory

2. **Community:**
   - Create Discord server
   - Start Telegram group
   - Engage with Solana developer community

3. **Features:**
   - Add resource reviews/ratings
   - Implement advanced search filters
   - Build mobile app (Expo + Solana Mobile)
   - Add resource categories/tags

4. **Analytics:**
   - Set up Google Analytics
   - Track resource creation
   - Monitor rental completion rate
   - Measure user retention

5. **Growth:**
   - Partner with AI agent developers
   - Onboard initial resource providers
   - Run promotional campaigns
   - Consider token launch for governance

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/maikershq/rentby/issues
- Documentation: See `/docs` folder
- Architecture: See `docs/ARCHITECTURE.md`

---

**Last Updated:** 2026-02-04
**Status:** Production Ready ✅
