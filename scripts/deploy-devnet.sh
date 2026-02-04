#!/bin/bash
set -e

echo "🚀 RentBy Devnet Deployment Script"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor CLI not found${NC}"
    echo "Install: https://www.anchor-lang.com/docs/installation"
    exit 1
fi

if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI not found${NC}"
    echo "Install: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"

# Set Solana to devnet
echo ""
echo "🔧 Configuring Solana for devnet..."
solana config set --url https://api.devnet.solana.com

# Check wallet
echo ""
echo "💰 Checking wallet..."
WALLET_BALANCE=$(solana balance)
echo "Wallet balance: $WALLET_BALANCE"

if [[ $WALLET_BALANCE == "0 SOL" ]]; then
    echo -e "${YELLOW}⚠️  Low balance. Requesting airdrop...${NC}"
    solana airdrop 2
fi

# Build program
echo ""
echo "🔨 Building Anchor program..."
anchor build

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/rentby-keypair.json)
echo -e "${GREEN}Program ID: $PROGRAM_ID${NC}"

# Deploy
echo ""
echo "🚀 Deploying to devnet..."
anchor deploy --provider.cluster devnet

echo ""
echo -e "${GREEN}✅ Smart contract deployed successfully!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Update Anchor.toml with program ID: $PROGRAM_ID"
echo "2. Update api/.env with RENTBY_PROGRAM_ID=$PROGRAM_ID"
echo "3. Update frontend/.env with NEXT_PUBLIC_RENTBY_PROGRAM_ID=$PROGRAM_ID"
echo "4. Run tests: anchor test --skip-deploy"
echo "5. Deploy API to Railway"
echo "6. Deploy frontend to Vercel"
echo ""
echo "See docs/DEPLOYMENT.md for detailed instructions."
