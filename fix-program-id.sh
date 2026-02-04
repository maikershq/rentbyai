#!/bin/bash

# Fix program ID mismatch by generating new keypair from existing program ID
set -e

NEW_PROGRAM_ID="HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3"
KEYPAIR_PATH="/root/.openclaw/workspace/rentby/target/deploy/rentby-keypair.json"

echo "Generating keypair from program ID: $NEW_PROGRAM_ID"

# Create temporary file with just the public key
echo "[$NEW_PROGRAM_ID]" > /tmp/program-pubkey.txt

# Generate new keypair using anchor (this will match the program ID)
cd /root/.openclaw/workspace/rentby
source "$HOME/.cargo/env"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Rebuild to ensure program ID matches
echo "Rebuilding program to ensure program ID matches..."
anchor build

# Deploy
echo "Deploying..."
anchor deploy --provider.cluster devnet --provider.wallet /tmp/deploy-keypair.json

echo "Done!"
