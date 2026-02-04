# RentBy Deployment Guide

Complete guide to deploying RentBy to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Smart Contract Deployment](#smart-contract-deployment)
3. [API Deployment (Railway)](#api-deployment-railway)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Domain Configuration](#domain-configuration)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [x] GitHub account (code already pushed)
- [ ] Solana wallet (Phantom/Solflare)
- [ ] Railway account (for API) - https://railway.app
- [ ] Vercel account (for frontend) - https://vercel.com
- [ ] Domain registrar access (for rentby.ai)

### Required Software
```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Verify installations
solana --version
anchor --version
```

---

## Smart Contract Deployment

### 1. Set Up Solana Wallet

```bash
# Create a new wallet (or import existing)
solana-keygen new --outfile ~/.config/solana/devnet.json

# Set to devnet
solana config set --url https://api.devnet.solana.com

# Set wallet
solana config set --keypair ~/.config/solana/devnet.json

# Airdrop SOL for testing (devnet only)
solana airdrop 2

# Check balance
solana balance
```

### 2. Build and Deploy Smart Contract

```bash
cd /root/.openclaw/workspace/rentby

# Build the program
anchor build

# Get the Program ID
solana address -k target/deploy/rentby-keypair.json

# Update Program ID in Anchor.toml and lib.rs
# Replace 'your_program_id_here' with the actual ID

# Deploy to devnet
anchor deploy

# Verify deployment
solana program show <PROGRAM_ID>
```

### 3. Update Configuration

After deployment, update the Program ID in:
- `Anchor.toml`
- `programs/rentby/src/lib.rs`
- `api/.env` → `PROGRAM_ID`
- `frontend/.env.local` → `NEXT_PUBLIC_PROGRAM_ID`

### 4. Mainnet Deployment (When Ready)

```bash
# Switch to mainnet
solana config set --url https://api.mainnet-beta.solana.com

# Fund wallet with real SOL (deployment costs ~2-5 SOL)
# Send SOL to your wallet address

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# ⚠️ Make sure to test thoroughly on devnet first!
```

---

## API Deployment (Railway)

### Option 1: Railway (Recommended)

Railway provides automatic deployments from GitHub with zero configuration.

#### Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `rentby` repository
5. Railway will auto-detect Node.js

#### Step 2: Configure Root Directory

1. In Railway project settings → "Service"
2. Set **Root Directory**: `api`
3. Railway will use `api/package.json` for build

#### Step 3: Add Environment Variables

In Railway dashboard → Variables:

```bash
PORT=3000
NODE_ENV=production
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=<your_deployed_program_id>
FRONTEND_URL=https://rentby.ai
```

#### Step 4: Deploy

1. Railway automatically deploys on push to main
2. Get your API URL: `https://rentby-api-production.up.railway.app`
3. Note this URL for frontend configuration

#### Step 5: Custom Domain (Optional)

1. Go to Settings → Domains
2. Add custom domain: `api.rentby.ai`
3. Configure DNS as instructed

### Option 2: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create rentby-api

# Add Node.js buildpack
heroku buildpacks:set heroku/nodejs

# Set root directory
heroku config:set PROJECT_PATH=api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
heroku config:set SOLANA_RPC_URL=https://api.devnet.solana.com
heroku config:set PROGRAM_ID=<your_program_id>
heroku config:set FRONTEND_URL=https://rentby.ai

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import `rentby` repository from GitHub
4. Vercel auto-detects Next.js

### Step 2: Configure Build Settings

1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build` (auto-detected)
3. **Output Directory**: `.next` (auto-detected)
4. **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

In Vercel project → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://rentby-api-production.up.railway.app
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=<your_deployed_program_id>
```

> **Note:** Update `NEXT_PUBLIC_API_URL` with your actual Railway API URL

### Step 4: Deploy

1. Click "Deploy"
2. Vercel builds and deploys automatically
3. Get preview URL: `https://rentby-username.vercel.app`

### Step 5: Custom Domain

1. Go to Settings → Domains
2. Add domain: `rentby.ai`
3. Configure DNS records:

```dns
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (~5-60 minutes)
5. Vercel automatically provisions SSL certificate

---

## Domain Configuration

### DNS Records for rentby.ai

Configure these records in your domain registrar:

```dns
# Frontend (Vercel)
A     @       76.76.21.21
CNAME www     cname.vercel-dns.com

# API (Railway or custom)
CNAME api     <railway-domain>.up.railway.app
# OR
A     api     <railway-ip-address>
```

### SSL Certificates

Both Vercel and Railway provide automatic SSL certificates:
- Vercel: Automatic via Let's Encrypt
- Railway: Automatic for custom domains

---

## Post-Deployment Testing

### 1. Test API Endpoints

```bash
# Health check
curl https://api.rentby.ai/health

# Get resources
curl https://api.rentby.ai/api/resources

# Get stats
curl https://api.rentby.ai/api/stats
```

### 2. Test Frontend

1. Visit https://rentby.ai
2. Browse resources page
3. Click on a resource to view details
4. Try creating a resource (requires wallet)

### 3. Test Wallet Connection

1. Install Phantom or Solflare wallet extension
2. Connect wallet on frontend
3. Switch to devnet in wallet settings
4. Create a test resource
5. Verify transaction on Solana Explorer

### 4. Test Smart Contract

```bash
# View program account
solana program show <PROGRAM_ID>

# Check program logs
solana logs <PROGRAM_ID>
```

---

## Monitoring & Maintenance

### Error Tracking

Set up error monitoring (optional but recommended):

```bash
# For API (Railway)
# Add to environment variables
SENTRY_DSN=<your_sentry_dsn>

# For Frontend (Vercel)
# Add to Vercel environment variables
NEXT_PUBLIC_SENTRY_DSN=<your_sentry_dsn>
```

### Logging

```bash
# Railway logs
# View in Railway dashboard or CLI:
railway logs

# Heroku logs
heroku logs --tail

# Vercel logs
# View in Vercel dashboard → Deployments → Logs
```

### Performance Monitoring

- Railway: Built-in metrics dashboard
- Vercel: Analytics available in dashboard
- Solana: Monitor RPC usage and transaction fees

---

## Troubleshooting

### Smart Contract Issues

**Problem:** Program deployment fails
```bash
# Check balance
solana balance

# Airdrop more SOL (devnet)
solana airdrop 2

# Check program size
ls -lh target/deploy/*.so
```

**Problem:** Program ID mismatch
```bash
# Regenerate Program ID
solana-keygen new -o target/deploy/rentby-keypair.json --force

# Update in Anchor.toml and lib.rs
# Rebuild and redeploy
anchor build && anchor deploy
```

### API Issues

**Problem:** API not starting on Railway
- Check environment variables are set
- Verify `PORT` is set to Railway's provided port
- Check logs for errors

**Problem:** CORS errors
- Verify `FRONTEND_URL` matches your Vercel domain
- Check CORS configuration in `api/src/index.js`

**Problem:** Solana RPC connection fails
- Test RPC URL: `curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'`
- Try alternative RPC: https://rpc.ankr.com/solana_devnet

### Frontend Issues

**Problem:** Build fails on Vercel
- Check `frontend/package.json` scripts
- Verify all dependencies are in `dependencies` (not `devDependencies`)
- Check build logs for missing environment variables

**Problem:** API requests fail (CORS)
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check API CORS configuration
- Test API directly: `curl https://api.rentby.ai/health`

**Problem:** Wallet connection fails
- Ensure wallet is on correct network (devnet/mainnet)
- Check browser console for errors
- Verify `NEXT_PUBLIC_SOLANA_RPC_URL` is accessible

### Domain Issues

**Problem:** Domain not resolving
- Use `dig rentby.ai` to check DNS records
- DNS propagation can take up to 48 hours (usually 5-60 minutes)
- Verify records in domain registrar dashboard

**Problem:** SSL certificate not working
- Vercel/Railway automatically provision SSL
- May take 15-30 minutes after DNS is set
- Check for HTTPS redirect in Vercel settings

---

## Rollback Procedures

### Smart Contract

```bash
# Smart contracts are immutable - you cannot rollback
# Instead, deploy a new version with fixes
# Update Program ID in all configs
```

### API

```bash
# Railway: Redeploy previous deployment in dashboard
# Heroku: Roll back release
heroku rollback

# Or redeploy specific commit
git push heroku <commit-sha>:main --force
```

### Frontend

```bash
# Vercel: Rollback in dashboard
# Or redeploy previous commit
vercel --prod --force
```

---

## Security Checklist

- [ ] Smart contract audited (recommended for mainnet)
- [ ] Environment variables secured (not in git)
- [ ] HTTPS enabled on all domains
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled on API
- [ ] Wallet connection secured (CSP headers)
- [ ] API keys rotated regularly
- [ ] Error messages don't leak sensitive data
- [ ] Dependencies updated (npm audit)

---

## Cost Estimates

### Devnet (Free)
- Solana Devnet: Free
- Railway: Free tier (500 hours/month)
- Vercel: Free tier (100 GB bandwidth)

### Mainnet (Production)
- Solana Program Deployment: ~2-5 SOL (one-time)
- Solana Transactions: ~0.000005 SOL per transaction
- Railway: $5-20/month (depending on usage)
- Vercel: Free (hobby) or $20/month (Pro)
- Domain: ~$15/year
- **Total:** ~$25-40/month + domain

---

## Next Steps After Deployment

1. **Test Everything**: Run through full user journey
2. **Monitor**: Set up alerts for errors/downtime
3. **Document**: Update README with live URLs
4. **Announce**: Share on Twitter, Discord, Solana forums
5. **Iterate**: Collect feedback and improve

---

## Support

- **Documentation**: See `docs/` folder
- **Issues**: GitHub Issues
- **Solana Docs**: https://docs.solana.com
- **Anchor Docs**: https://www.anchor-lang.com

---

**Last Updated**: 2026-02-04
