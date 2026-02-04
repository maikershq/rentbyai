# RentBy Deployment Guide

Complete guide for deploying RentBy to production.

## Overview

- **Frontend**: Vercel (Next.js)
- **API**: Railway (Node.js/Express)
- **Smart Contracts**: Solana (devnet → mainnet)
- **Domain**: rentby.ai

## Prerequisites

- GitHub account (✅ configured with SSH)
- Railway account (free tier available)
- Vercel account (free tier available)
- Solana CLI installed
- Anchor CLI installed
- Domain rentby.ai configured

## 1. Deploy Smart Contracts to Devnet

```bash
cd /root/.openclaw/workspace/rentby

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Save the program ID (shown after deployment)
# Update it in Anchor.toml and .env files
```

**Important**: Copy the program ID from deployment output!

## 2. Deploy API to Railway

### Option A: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd api
railway init

# Add environment variables
railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set SOLANA_RPC_URL=https://api.devnet.solana.com
railway variables set SOLANA_NETWORK=devnet
railway variables set RENTBY_PROGRAM_ID=<your_program_id>
railway variables set CORS_ORIGIN=https://rentby.ai,https://www.rentby.ai

# Deploy
railway up
```

### Option B: Via Railway Dashboard

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `maikershq/rentbyai` repository
4. Set root directory: `api`
5. Add environment variables (see `.env.example`)
6. Deploy!

### Get API URL

After deployment, Railway will provide a URL like:
`https://rentby-api-production.up.railway.app`

Update frontend config with this URL.

## 3. Deploy Frontend to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from root directory
cd /root/.openclaw/workspace/rentby
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: rentby
# - Directory: frontend
# - Build command: npm run build
# - Output directory: .next

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://rentby-api-production.up.railway.app

vercel env add NEXT_PUBLIC_SOLANA_NETWORK production
# Enter: devnet

vercel env add NEXT_PUBLIC_SOLANA_RPC_URL production
# Enter: https://api.devnet.solana.com

vercel env add NEXT_PUBLIC_RENTBY_PROGRAM_ID production
# Enter: <your_program_id>

# Deploy to production
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `maikershq/rentbyai` from GitHub
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables (see `frontend/.env.example`)
6. Deploy!

## 4. Configure Custom Domain

### Railway (API)

1. In Railway dashboard → Settings → Domains
2. Add custom domain: `api.rentby.ai`
3. Add DNS records at your domain provider:
   ```
   CNAME api -> <railway-subdomain>.up.railway.app
   ```

### Vercel (Frontend)

1. In Vercel dashboard → Settings → Domains
2. Add domains:
   - `rentby.ai`
   - `www.rentby.ai`
3. Add DNS records at your domain provider:
   ```
   A     @   -> 76.76.21.21
   CNAME www -> cname.vercel-dns.com
   ```

## 5. Update Environment Variables

After getting production URLs, update:

### Frontend `.env.production`
```env
NEXT_PUBLIC_API_URL=https://api.rentby.ai
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_RENTBY_PROGRAM_ID=<your_program_id>
```

### API Environment Variables
```env
PORT=3001
NODE_ENV=production
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
RENTBY_PROGRAM_ID=<your_program_id>
CORS_ORIGIN=https://rentby.ai,https://www.rentby.ai
```

## 6. Deploy to Mainnet (Production)

⚠️ **Only after thorough testing on devnet!**

```bash
# Build with mainnet config
anchor build

# Deploy to mainnet
anchor deploy --provider.cluster mainnet-beta

# Update all environment variables:
# - SOLANA_NETWORK=mainnet-beta
# - SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# - RENTBY_PROGRAM_ID=<new_mainnet_program_id>

# Redeploy API and Frontend with new config
```

## 7. Post-Deployment Checklist

- [ ] Smart contract deployed to devnet
- [ ] API deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Custom domains configured (api.rentby.ai, rentby.ai)
- [ ] DNS records added and propagated
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] SSL/HTTPS working on all domains
- [ ] Test wallet connection (Phantom/Solflare)
- [ ] Test resource creation
- [ ] Test rental flow
- [ ] Test dispute resolution
- [ ] Monitor for errors (Railway logs, Vercel logs)

## 8. Monitoring & Maintenance

### Railway (API)
- View logs: Railway dashboard → Deployments → Logs
- Monitor usage: Railway dashboard → Metrics
- Set up alerts for errors

### Vercel (Frontend)
- View logs: Vercel dashboard → Deployments → Function Logs
- Monitor analytics: Vercel dashboard → Analytics
- Check build logs for errors

### Solana Program
- Monitor transactions on Solana Explorer
- Check program account usage
- Monitor rent costs

## 9. Troubleshooting

### Common Issues

**CORS Errors**
- Check API `CORS_ORIGIN` includes your frontend domain
- Ensure protocol (https://) matches

**Wallet Connection Failed**
- Verify `NEXT_PUBLIC_SOLANA_NETWORK` matches program deployment
- Check RPC URL is accessible
- Ensure program ID is correct

**API Not Responding**
- Check Railway logs for errors
- Verify environment variables are set
- Test API directly: `curl https://api.rentby.ai/health`

**Build Failures**
- Check Node.js version matches (v18+)
- Clear `.next` cache and rebuild
- Verify all dependencies installed

## 10. Scaling Considerations

### When Traffic Grows

**API (Railway)**
- Upgrade to higher tier for more resources
- Add Redis for caching
- Implement rate limiting
- Consider load balancer

**Frontend (Vercel)**
- Vercel auto-scales
- Enable Analytics to monitor usage
- Optimize images and assets
- Implement CDN for static assets

**Solana**
- Switch to dedicated RPC node (Helius, QuickNode)
- Optimize transaction batching
- Implement retry logic
- Monitor compute units usage

## Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Anchor Docs: https://www.anchor-lang.com/docs
- Solana Docs: https://docs.solana.com

## Support

- GitHub Issues: https://github.com/maikershq/rentbyai/issues
- Email: support@rentby.ai
