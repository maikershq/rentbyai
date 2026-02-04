# 🔧 Troubleshooting Guide

Common deployment issues and how to fix them.

---

## Table of Contents

- [API Issues](#api-issues)
- [Frontend Issues](#frontend-issues)
- [Smart Contract Issues](#smart-contract-issues)
- [Database Issues](#database-issues)
- [CORS Issues](#cors-issues)
- [Performance Issues](#performance-issues)

---

## API Issues

### API won't start / crashes immediately

**Symptoms:**
- Service fails to start
- Crashes after a few seconds
- "Module not found" errors

**Solutions:**

1. **Check Node version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

2. **Verify dependencies are installed:**
   ```bash
   cd api
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check environment variables:**
   ```bash
   # Required variables:
   SOLANA_NETWORK=devnet
   SOLANA_RPC_URL=https://api.devnet.solana.com
   PORT=3001
   ```

4. **Check logs:**
   - **Render:** Dashboard → Logs
   - **Railway:** Project → Deployments → View logs
   - **Fly.io:** `flyctl logs`

---

### Health endpoint returns 500 error

**Symptoms:**
- `/health` returns 500
- Cannot connect to Solana RPC

**Solutions:**

1. **Verify RPC URL is correct:**
   ```bash
   curl https://api.devnet.solana.com
   # Should return Solana RPC response
   ```

2. **Check if RPC is rate-limited:**
   - Public RPCs have rate limits
   - Consider using QuickNode, Alchemy, or Helius for production

3. **Test connection locally:**
   ```bash
   curl http://localhost:3001/health
   ```

---

### API endpoints return empty arrays

**Symptoms:**
- `/api/resources` returns `[]`
- `/api/rentals` returns `[]`

**Expected Behavior:**
- This is normal for a fresh deployment
- No data exists until resources are created

**Test by creating a resource:**
```bash
curl -X POST http://your-api-url/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test GPU",
    "type": "gpu",
    "description": "Test resource",
    "price": 1.0,
    "available": true
  }'
```

---

## Frontend Issues

### Frontend shows "Failed to fetch" errors

**Symptoms:**
- API calls fail
- Network errors in browser console
- CORS errors

**Solutions:**

1. **Verify API URL is set:**
   ```bash
   # Check .env.production
   cat frontend/.env.production
   # Should contain:
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

2. **Rebuild frontend:**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for CORS errors (see [CORS Issues](#cors-issues))

---

### Frontend shows blank page

**Symptoms:**
- White screen
- No errors in console
- Build succeeds but page is empty

**Solutions:**

1. **Check build output:**
   ```bash
   cd frontend
   npm run build
   # Look for errors during build
   ```

2. **Verify Next.js version:**
   ```bash
   cat frontend/package.json | grep next
   # Should be "next": "^14.0.0" or higher
   ```

3. **Check for JavaScript errors:**
   - Open browser DevTools (F12)
   - Check Console tab for errors

---

### Images/assets not loading

**Symptoms:**
- 404 errors for images
- Broken image icons

**Solutions:**

1. **Verify Vercel configuration:**
   ```json
   // vercel.json should have:
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next"
   }
   ```

2. **Check image paths:**
   - Use relative paths: `/images/logo.png`
   - Not absolute: `http://example.com/images/logo.png`

---

## Smart Contract Issues

### "blake3" or "edition2024" errors

**Symptoms:**
```
error: package `blake3 v1.5.5` cannot be built because it requires rustc 1.85.0 or newer
```

**Solution:**

This is a known Solana/Anchor toolchain compatibility issue.

**Option A: Use Docker (Recommended)**
```bash
cd /root/.openclaw/workspace/rentby
./scripts/docker-build-contracts.sh
```

**Option B: Wait for Solana update**
- Solana 1.18.x will include Rust 1.85+
- Track progress: https://github.com/solana-labs/solana/issues

**Option C: Deploy API/Frontend first**
- Smart contracts can be added later
- Use mock data for testing

---

### Anchor deploy fails with "Insufficient funds"

**Symptoms:**
```
Error: Insufficient funds for deployment
```

**Solutions:**

1. **Check wallet balance:**
   ```bash
   solana balance
   # Should show at least 5 SOL on devnet
   ```

2. **Request devnet SOL:**
   ```bash
   solana airdrop 2
   # Or use: https://faucet.solana.com
   ```

3. **Verify network:**
   ```bash
   solana config get
   # Should show: RPC URL: https://api.devnet.solana.com
   ```

---

### Program deploy succeeds but transactions fail

**Symptoms:**
- `anchor deploy` succeeds
- Transactions return errors

**Solutions:**

1. **Verify program ID matches:**
   ```bash
   # Check lib.rs
   grep "declare_id" programs/rentby/src/lib.rs
   
   # Check Anchor.toml
   grep "rentby =" Anchor.toml
   
   # Should match!
   ```

2. **Redeploy after ID change:**
   ```bash
   anchor build
   anchor deploy
   ```

3. **Check transaction logs:**
   ```bash
   solana logs --url devnet
   # Watch for errors
   ```

---

## Database Issues

### In-memory database resets on restart

**Expected Behavior:**
- Current implementation uses in-memory storage
- Data is lost on restart

**Solutions:**

1. **For Production:** Add PostgreSQL
   ```bash
   # See docs/DEPLOYMENT.md for database setup
   ```

2. **For Testing:** Accept temporary data
   - Data resets are normal
   - Use for demo/testing only

---

## CORS Issues

### "CORS policy blocked" errors

**Symptoms:**
```
Access to fetch at 'http://api.example.com' from origin 'http://frontend.example.com' 
has been blocked by CORS policy
```

**Solutions:**

1. **Verify CORS is enabled in API:**
   ```javascript
   // api/src/index.js should have:
   app.use(cors());
   ```

2. **Check allowed origins:**
   ```javascript
   // For production, configure specific origins:
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*'
   }));
   ```

3. **Add environment variable:**
   ```bash
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

---

## Performance Issues

### API responds slowly

**Symptoms:**
- Requests take >2 seconds
- Timeouts on frontend

**Solutions:**

1. **Check RPC latency:**
   ```bash
   time curl https://api.devnet.solana.com
   # Should be <500ms
   ```

2. **Use private RPC endpoint:**
   - QuickNode: https://quicknode.com
   - Alchemy: https://alchemy.com
   - Helius: https://helius.xyz

3. **Add caching:**
   ```javascript
   // Cache frequently accessed data
   // See docs/ARCHITECTURE.md
   ```

---

### Frontend loads slowly

**Symptoms:**
- Initial page load >3 seconds
- Large bundle sizes

**Solutions:**

1. **Check bundle size:**
   ```bash
   cd frontend
   npm run build
   # Look for warnings about large bundles
   ```

2. **Enable image optimization:**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['your-api-domain.com']
     }
   }
   ```

3. **Use Vercel CDN:**
   - Static assets automatically cached
   - Edge network for global delivery

---

## Platform-Specific Issues

### Render

**Build fails:**
- Check build command: `npm install`
- Check start command: `npm start`
- Root directory should be `api` for API service

**503 errors:**
- Free tier spins down after 15min inactivity
- First request after sleep takes ~30 seconds

---

### Railway

**"Unauthorized" errors:**
- Token might be read-only
- Need project-level token
- Get from: https://railway.app/account/tokens

**Build timeout:**
- Increase timeout in project settings
- Or reduce build time (remove dev dependencies)

---

### Vercel

**Build fails:**
- Check Node version in settings (should be 18.x)
- Verify `npm run build` works locally
- Check environment variables are set

**Functions timeout:**
- Vercel has 10s serverless timeout
- Optimize API calls
- Consider upgrading plan for longer timeouts

---

### Fly.io

**Deployment hangs:**
```bash
# Cancel and retry:
Ctrl+C
flyctl deploy --force
```

**Region issues:**
```bash
# Deploy to specific region:
flyctl regions add ewr
flyctl deploy
```

---

## Getting Help

### Check logs first

**Render:**
```
Dashboard → Logs tab
```

**Railway:**
```
Project → Deployments → View logs
```

**Vercel:**
```
Dashboard → Deployments → View logs
```

**Fly.io:**
```bash
flyctl logs
```

---

### Run verification script

```bash
cd /root/.openclaw/workspace/rentby
./scripts/verify-deployment.sh
```

Provides detailed health checks for API and frontend.

---

### Common Log Messages

**"ECONNREFUSED":**
- Service not running
- Check if deployment succeeded

**"Module not found":**
- Dependencies not installed
- Run `npm install` in correct directory

**"Port already in use":**
- Another process using the port
- Change PORT environment variable

**"Invalid program ID":**
- Program ID mismatch
- Rebuild and redeploy contracts

---

## Still Stuck?

1. **Check documentation:**
   - `docs/DEPLOYMENT.md` - Deployment guide
   - `docs/ARCHITECTURE.md` - System architecture
   - `docs/SECURITY.md` - Security best practices

2. **Run diagnostics:**
   ```bash
   ./scripts/pre-deploy-check.sh
   ```

3. **Test locally:**
   ```bash
   # API
   cd api && npm start
   
   # Frontend
   cd frontend && npm run dev
   ```

4. **Verify GitHub repo:**
   - Ensure latest code is pushed
   - Check Actions tab for CI status

---

**Last Updated:** 2026-02-04  
**Version:** 1.0
