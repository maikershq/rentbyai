#!/bin/bash
# Build Anchor smart contracts using Docker (solves Rust version issues)

set -e

echo "🏗️  Building RentBy smart contracts with Docker..."
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Build Docker image
echo "📦 Building Docker image with Rust 1.85.0..."
docker build -f Dockerfile.anchor -t rentby-anchor-build .

# Run build in container
echo ""
echo "🔨 Building smart contracts..."
docker run --rm -v "$(pwd)":/workspace rentby-anchor-build

echo ""
echo "✅ Smart contracts built successfully!"
echo "📁 Output: target/deploy/rentby.so"
echo ""
echo "Next steps:"
echo "  1. Deploy to devnet: anchor deploy --provider.cluster devnet"
echo "  2. Update program ID in: Anchor.toml, programs/rentby/src/lib.rs"
echo "  3. Rebuild: ./scripts/docker-build-contracts.sh"
