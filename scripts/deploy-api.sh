#!/bin/bash
set -e

echo "🚀 RentBy API Deployment Script (Railway)"
echo "==========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway..."
    railway login
fi

# Navigate to API directory
cd "$(dirname "$0")/../api"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🧪 Running tests..."
npm test

echo ""
echo "🔧 Initializing Railway project..."
railway init || echo "Project already initialized"

echo ""
echo "⚙️  Setting environment variables..."
echo "Enter your program ID:"
read -r PROGRAM_ID

railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set SOLANA_RPC_URL=https://api.devnet.solana.com
railway variables set SOLANA_NETWORK=devnet
railway variables set RENTBY_PROGRAM_ID="$PROGRAM_ID"
railway variables set CORS_ORIGIN="https://rentby.ai,https://www.rentby.ai"

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo -e "${GREEN}✅ API deployed successfully!${NC}"
echo ""
railway status

echo ""
echo "📝 Next steps:"
echo "1. Get your API URL from Railway dashboard"
echo "2. Configure custom domain: api.rentby.ai"
echo "3. Update frontend .env with API URL"
echo "4. Test API: curl https://<your-url>/health"
