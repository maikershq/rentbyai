# RentBy Program Deployment Guide

## 🚦 Current Status

### ✅ Ready to Deploy
- **Program compiled:** ✅ `/root/.openclaw/workspace/rentby/target/sbpf-solana-solana/release/rentby.so` (400KB)
- **Program ID configured:** ✅ `HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3`
- **Deployer keypair:** ✅ `/tmp/deploy-keypair.json`
- **On-chain status:** ❌ Not deployed yet (account doesn't exist on devnet)

### ❌ Missing Tools
- **Solana CLI:** Not installed
- **Anchor CLI:** Not installed
- **Docker:** Not available
- **Direct web3.js deployment:** Not possible (BPFLoader not exposed in library)

---

## 🎯 Deployment Methods

### Method 1: Install Solana CLI (Recommended)

```bash
# Install Solana CLI
curl -sSfL https://release.solana.com/v1.18/install | sh
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Configure for devnet
solana config set --url https://api.devnet.solana.com

# Request airdrop if needed
solana airdrop 2

# Deploy
cd /root/.openclaw/workspace/rentby
anchor deploy --provider.cluster devnet
```

**Pros:**
- Standard deployment method
- Supports program upgrades
- Verifies deployment automatically

**Cons:**
- Requires Rust/Cargo installation
- Takes ~10-15 minutes to install

---

### Method 2: Use Docker (If Available)

```bash
# Deploy using official Anchor Docker image
docker run --rm -v $(pwd):/workdir \
  -w /workdir \
  coralxyz/anchor:latest \
  bash -c "anchor deploy --provider.cluster devnet"
```

**Pros:**
- No local installation needed
- Isolated environment

**Cons:**
- Docker not available on this system

---

### Method 3: GitHub Actions CI/CD (Best for Production)

Create a workflow file in `.github/workflows/deploy-program.yml`:

```yaml
name: Deploy Program

on:
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Solana CLI
        run: sh -c "$(curl -sSfL https://release.solana.com/install)"

      - name: Install Anchor
        run: |
          cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
          avm install latest
          avm use latest

      - name: Configure Solana
        run: |
          export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
          solana config set --url devnet
          solana airdrop 2

      - name: Build and Deploy
        run: |
          export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
          anchor build
          anchor deploy --provider.cluster devnet

      - name: Verify Deployment
        run: |
          export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
          solana program show HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3
```

Then trigger it manually from GitHub Actions tab.

**Pros:**
- Automated deployment
- Reproducible builds
- Works from any machine
- Can integrate with main branch

**Cons:**
- Requires GitHub Actions configuration
- Not instant deployment

---

### Method 4: Use External Service

Deploy the program using:
- [Solplayground](https://beta.solpg.io) - No longer active
- [Solana CLI on another machine]
- [RPC provider's deployment service]

**Note:** Most public playgrounds have been deprecated.

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Program compiled (rentby.so exists)
- [x] Program ID configured in Anchor.toml
- [x] Deployer keypair generated
- [x] Git repository initialized

### ⏳ Pending
- [ ] Install Solana CLI or use CI/CD
- [ ] Install Anchor CLI
- [ ] Request devnet airdrop for deployer wallet
- [ ] Deploy program to devnet
- [ ] Verify deployment on Solscan
- [ ] Update API .env with program ID
- [ ] Update frontend .env with program ID

---

## 🔧 Environment Variables

After deployment, update these files:

### API Configuration (`api/.env` or `api/.env.production`)
```bash
RENTBY_PROGRAM_ID=HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Frontend Configuration (`app/.env.local` or `app/.env.production`)
```bash
NEXT_PUBLIC_RENTBY_PROGRAM_ID=HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## 🎯 Quick Deployment Command (When Tools Are Installed)

```bash
cd /root/.openclaw/workspace/rentby

# Single command
anchor deploy --provider.cluster devnet

# Or with verbose output
anchor deploy --provider.cluster devnet --provider.wallet /tmp/deploy-keypair.json
```

**Expected Output:**
```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: RKd8cg6mopNnLJVTGnXrDYG6UTQhdFNmPKFfv7VpzQM
Deploying program "rentby"...
Program path: /root/.openclaw/workspace/rentby/target/deploy/rentby.so...
Program Id: HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3
```

---

## 🔗 Verification Links

After deployment, verify at:

**Solscan (Devnet):**
https://solscan.io/account/HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3?cluster=devnet

**Solana Explorer (Devnet):**
https://explorer.solana.com/address/HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3?cluster=devnet

---

## 💡 Troubleshooting

### Error: "Insufficient funds"
```bash
# Request airdrop
solana airdrop 2

# Or transfer SOL from another wallet
solana transfer <from-keypair> RKd8cg6mopNnLJVTGnXrDYG6UTQhdFNmPKFfv7VpzQM 2
```

### Error: "Program already deployed"
The program ID is already in use. Either:
- Use the existing deployment
- Generate a new program ID and update Anchor.toml

### Error: "Invalid program id"
Check that the program ID matches what's in `programs/rentby/src/lib.rs`:
```rust
declare_id!("HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3");
```

---

## 📊 Deployment Cost Estimate

**Devnet:** Free (airdrops available)
**Testnet:** Free (airdrops available)
**Mainnet:** ~1-2 SOL (for rent + transaction fees)

---

## 🎯 Recommended Next Steps

1. **For Immediate Deployment:**
   - Install Solana CLI using the install script
   - Run `anchor deploy --provider.cluster devnet`
   - Verify on Solscan

2. **For Long-term:**
   - Set up GitHub Actions for automated deployment
   - Configure environment variables for API and frontend
   - Test program interactions

3. **For Hackathon:**
   - Deploy to devnet once
   - Use the same deployment for all testing
   - Update environment variables

---

## 📝 Summary

**Status:** Program compiled, ready to deploy
**Blocker:** Solana CLI not installed
**Solution:** Use Method 1 (install CLI) or Method 3 (GitHub Actions)
**Time to deploy:** 10-15 minutes (once CLI is installed)

**Program ID:** `HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3`
**Solscan:** https://solscan.io/account/HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3?cluster=devnet

---

**Last Updated:** 2026-02-04 11:00 UTC
