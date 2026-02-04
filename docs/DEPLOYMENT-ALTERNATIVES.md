# Deployment Alternatives

This document explores alternative deployment platforms to Railway/Vercel, with a focus on ease of setup and free tiers.

## Current Blockers (2026-02-04 02:43 UTC)

1. **Smart Contracts:** ✅ Docker solution created, but Docker not available on deployment machine
2. **API (Railway):** ❌ Token authentication failed
3. **Frontend (Vercel):** ⏸️ Ready, but needs API URL first

## Alternative Platforms for API Deployment

### 1. Render.com
**Pros:**
- Generous free tier (750 hours/month)
- Simple Git-based deployment
- No credit card required for free tier
- PostgreSQL included
- Auto-deploy on Git push
- Easy environment variable management

**Setup:**
```bash
# No CLI needed - deploy via web dashboard
# 1. Connect GitHub repo
# 2. Select api/ directory as root
# 3. Build command: npm install
# 4. Start command: npm start
# 5. Add environment variables
```

**Cost:** Free tier available, paid starts at $7/month

### 2. Heroku
**Pros:**
- Well-established platform
- Simple git push deployment
- Large ecosystem of add-ons
- Excellent documentation
- PostgreSQL add-on available

**Cons:**
- Free tier eliminated (minimum $5/month for Eco Dynos)
- Requires credit card even for Eco tier

**Setup:**
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login and create app
heroku login
heroku create rentby-api

# Add buildpack and deploy
heroku buildpacks:set heroku/nodejs
git subtree push --prefix api heroku main

# Set environment variables
heroku config:set SOLANA_NETWORK=devnet
heroku config:set SOLANA_RPC_URL=https://api.devnet.solana.com
```

**Cost:** $5/month minimum (Eco Dynos)

### 3. DigitalOcean App Platform
**Pros:**
- $5/month starter tier
- Good performance
- Easy scaling
- Integrated with DO ecosystem (databases, spaces, etc.)
- Git-based deployment

**Setup:**
```bash
# Install doctl
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
tar xf doctl-*.tar.gz
sudo mv doctl /usr/local/bin

# Login
doctl auth init

# Create app spec
cat > .do/app.yaml << 'EOF'
name: rentby-api
region: nyc
services:
- name: api
  github:
    repo: maikershq/rentbyai
    branch: main
    deploy_on_push: true
  source_dir: /api
  build_command: npm install
  run_command: npm start
  envs:
  - key: SOLANA_NETWORK
    value: devnet
  - key: SOLANA_RPC_URL
    value: https://api.devnet.solana.com
  - key: PORT
    value: "8080"
  instance_count: 1
  instance_size_slug: basic-xxs
EOF

# Deploy
doctl apps create --spec .do/app.yaml
```

**Cost:** $5/month minimum

### 4. Fly.io
**Pros:**
- Generous free tier (3 shared-cpu VMs, 3GB storage)
- Global edge deployment
- Docker-based (full control)
- Free PostgreSQL on free tier
- Automatic SSL

**Setup:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Initialize and deploy
cd api
flyctl launch --name rentby-api --region ewr
flyctl deploy
```

**Cost:** Free tier available, paid starts at $1.94/month per VM

### 5. Railway (Current Choice - Needs Valid Token)
**Status:** Token authentication failed. Need valid project-level token.

**How to get correct token:**
1. Go to https://railway.app/account/tokens
2. Create new token
3. Use it with: `railway login --token YOUR_TOKEN`

## Recommended Next Steps

### Option A: Try Render (Easiest)
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect `maikershq/rentbyai` repository
5. Root directory: `api`
6. Build: `npm install`
7. Start: `npm start`
8. Add environment variables:
   - `SOLANA_NETWORK=devnet`
   - `SOLANA_RPC_URL=https://api.devnet.solana.com`
   - `PORT=10000`
9. Deploy!

### Option B: Fix Railway Token
1. Get new project token from Railway dashboard
2. Update `.railway-credentials.json`
3. Run `scripts/deploy-api.sh`

### Option C: Use Fly.io (Best Free Tier)
1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. Login: `flyctl auth login`
3. Deploy: `cd api && flyctl launch`

## Frontend Deployment (After API is Live)

Once API is deployed to any platform above:

1. **Update Frontend Config:**
   ```bash
   # Update frontend/.env.production
   NEXT_PUBLIC_API_URL=https://your-api-url.onrender.com
   ```

2. **Deploy to Vercel:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Or Deploy to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   cd frontend
   netlify deploy --prod
   ```

## Smart Contracts (When Docker Available)

The Docker build solution is ready:
```bash
# On a machine with Docker installed:
./scripts/docker-build-contracts.sh

# Then deploy:
anchor deploy --provider.cluster devnet
```

## Summary

**Immediate Action (Choose One):**
- 🏆 **Render:** Easiest, no CLI needed, good free tier
- 💰 **Fly.io:** Best free tier, but requires CLI setup
- 🔧 **Railway:** Fix token and use existing setup
- 💵 **Heroku:** Most mature, but $5/month minimum

**After API Deploys:**
1. Update `frontend/.env.production` with API URL
2. Deploy frontend to Vercel (already authenticated)
3. Test end-to-end
4. Deploy smart contracts when Docker is available

**Time Estimate:**
- Render/Netlify deployment: 10-15 minutes
- Fly.io deployment: 20-30 minutes
- Railway (if token fixed): 5 minutes
- Smart contracts: Waiting on Docker availability
