#!/bin/bash

# Quick Solana CLI installer (alternative mirror)
# Attempts to install Solana CLI without using problematic mirrors

set -e

echo "🚀 Attempting to install Solana CLI..."
echo "===================================="

# Try installing via npm package
echo ""
echo "📦 Attempting npm install of @solana/web3.js CLI..."
npm install -g @solana/cli 2>&1 || echo "npm install failed"

# Check if solana is available
if command -v solana &> /dev/null; then
    echo ""
    echo "✅ Solana CLI installed via npm!"
    solana --version
    exit 0
fi

# Alternative: Use pre-compiled binary
echo ""
echo "📥 Attempting to download pre-compiled binary..."
SOLANA_VERSION="1.18.18"
BINARY_URL="https://github.com/solana-labs/solana/releases/download/v${SOLANA_VERSION}/solana-release-x86_64-unknown-linux-gnu.tar.bz2"

cd /tmp
wget -O solana.tar.bz2 "$BINARY_URL" 2>&1 || {
    echo "❌ Failed to download binary"
    echo ""
    echo "Alternative approaches:"
    echo "  1. Use GitHub Actions CI/CD to deploy"
    echo "  2. Use a different machine with Solana CLI installed"
    echo "  3. Use Docker: docker run --rm -v $(pwd):/workdir solanalabs/solana:v1.18.18"
    echo ""
    exit 1
}

# Extract
echo "📦 Extracting..."
tar -xjf solana.tar.bz2
export PATH="/tmp/solana-release/bin:$PATH"

# Verify
if command -v solana &> /dev/null; then
    echo ""
    echo "✅ Solana CLI installed!"
    solana --version

    # Copy to /usr/local/bin for persistence
    sudo mv /tmp/solana-release/bin/solana /usr/local/bin/ 2>/dev/null || echo "Note: Not in PATH for current session"
    sudo mv /tmp/solana-release/bin/solana-keygen /usr/local/bin/ 2>/dev/null

    echo ""
    echo "Next steps:"
    echo "  1. Configure devnet: solana config set --url devnet"
    echo "  2. Check balance: solana balance"
    echo "  3. Deploy: cd /root/.openclaw/workspace/rentby && anchor deploy --provider.cluster devnet"
    exit 0
fi

echo "❌ Installation failed"
exit 1
