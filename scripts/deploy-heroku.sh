#!/bin/bash
# Deploy RentBy API to Heroku
set -e

echo "🚀 Deploying RentBy API to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Install it first:"
    echo "   npm install -g heroku"
    exit 1
fi

# Check if logged in
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged in to Heroku. Run: heroku login"
    exit 1
fi

# Check if Heroku app exists
APP_NAME="rentby-api"
if heroku apps:info --app $APP_NAME &> /dev/null; then
    echo "✅ Heroku app '$APP_NAME' already exists"
else
    echo "📦 Creating Heroku app '$APP_NAME'..."
    heroku create $APP_NAME
fi

# Set environment variables
echo "🔧 Setting environment variables..."
heroku config:set \
    NODE_ENV=production \
    PORT=3001 \
    SOLANA_RPC_URL=https://api.devnet.solana.com \
    PROGRAM_ID=HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3 \
    --app $APP_NAME

# Add Heroku remote if it doesn't exist
if ! git remote | grep -q "^heroku$"; then
    echo "🔗 Adding Heroku remote..."
    heroku git:remote --app $APP_NAME
fi

# Deploy
echo "🚢 Pushing to Heroku..."
git push heroku main

# Run health check
echo "🏥 Running health check..."
sleep 5
HEALTH_URL="https://$APP_NAME.herokuapp.com/health"
if curl -sf "$HEALTH_URL" > /dev/null; then
    echo "✅ API is healthy!"
    echo "🌐 API URL: https://$APP_NAME.herokuapp.com"
else
    echo "⚠️  Health check failed. Check logs: heroku logs --tail --app $APP_NAME"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo "   API: https://$APP_NAME.herokuapp.com"
echo "   Health: $HEALTH_URL"
echo "   Logs: heroku logs --tail --app $APP_NAME"
