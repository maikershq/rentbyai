#!/bin/bash
set -e

echo "🚀 RentBy Frontend Deployment Script (Vercel)"
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building frontend..."
npm run build

echo ""
echo "⚙️  Configuring environment variables..."
echo "Enter your API URL (e.g., https://api.rentby.ai):"
read -r API_URL

echo "Enter your program ID:"
read -r PROGRAM_ID

echo ""
echo "Setting environment variables for production..."
vercel env add NEXT_PUBLIC_API_URL production <<< "$API_URL"
vercel env add NEXT_PUBLIC_SOLANA_NETWORK production <<< "devnet"
vercel env add NEXT_PUBLIC_SOLANA_RPC_URL production <<< "https://api.devnet.solana.com"
vercel env add NEXT_PUBLIC_RENTBY_PROGRAM_ID production <<< "$PROGRAM_ID"

echo ""
echo "🚀 Deploying to Vercel..."
cd ..
vercel --prod

echo ""
echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Configure custom domain: rentby.ai"
echo "2. Test the app in your browser"
echo "3. Connect a Solana wallet (Phantom/Solflare)"
echo "4. Test creating resources and rentals"
