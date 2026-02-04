#!/bin/bash
# Pre-deployment validation script for RentBy
# Checks if all prerequisites are met before deployment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔍 RentBy Pre-Deployment Check"
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check if a command exists
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check if a file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2 - Missing: $1"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check credentials
check_credentials() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $2 - Missing: $1"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

echo "📦 Checking Required Software..."
check_command "git"
check_command "node"
check_command "npm"
check_command "cargo"
if check_command "solana"; then
    solana --version | head -n 1
fi
if check_command "anchor"; then
    anchor --version
fi

echo ""
echo "📁 Checking Project Files..."
cd "$PROJECT_ROOT"
check_file "README.md" "README.md"
check_file "docs/DEPLOYMENT.md" "Deployment guide"
check_file "docs/ARCHITECTURE.md" "Architecture documentation"
check_file "api/package.json" "API package.json"
check_file "app/package.json" "Frontend package.json"
check_file "programs/rentby/Cargo.toml" "Smart contract Cargo.toml"
check_file "api/railway.json" "Railway config"
check_file "vercel.json" "Vercel config"
check_file "api/.env.example" "API environment template"
check_file "frontend/.env.example" "Frontend environment template"

echo ""
echo "🔑 Checking Credentials..."
check_credentials "$HOME/.openclaw/workspace/.railway-credentials.json" "Railway token"
check_credentials "$HOME/.openclaw/workspace/.vercel-credentials.json" "Vercel token"
check_credentials "$HOME/.openclaw/workspace/.github-credentials.json" "GitHub token"

echo ""
echo "🚀 Checking Deployment Scripts..."
check_file "scripts/deploy-devnet.sh" "Devnet deployment script"
check_file "scripts/deploy-api.sh" "API deployment script"
check_file "scripts/deploy-frontend.sh" "Frontend deployment script"

echo ""
echo "🧪 Checking Tests..."
check_file "tests/rentby.ts" "Smart contract tests"
check_file "api/tests/api.test.js" "API tests"

echo ""
echo "📊 Checking Git Status..."
cd "$PROJECT_ROOT"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    
    # Check if there are uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓${NC} No uncommitted changes"
    else
        echo -e "${YELLOW}⚠${NC} Uncommitted changes detected"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check if branch is up to date with origin
    if git rev-parse --abbrev-ref HEAD &> /dev/null; then
        BRANCH=$(git rev-parse --abbrev-ref HEAD)
        echo -e "${GREEN}✓${NC} Current branch: $BRANCH"
        
        # Check if remote exists
        if git remote get-url origin &> /dev/null; then
            echo -e "${GREEN}✓${NC} Remote configured"
            
            # Check if we're ahead/behind
            git fetch &> /dev/null || true
            AHEAD=$(git rev-list origin/$BRANCH..$BRANCH 2>/dev/null | wc -l)
            BEHIND=$(git rev-list $BRANCH..origin/$BRANCH 2>/dev/null | wc -l)
            
            if [ "$AHEAD" -gt 0 ]; then
                echo -e "${YELLOW}⚠${NC} $AHEAD commits ahead of origin"
                WARNINGS=$((WARNINGS + 1))
            fi
            
            if [ "$BEHIND" -gt 0 ]; then
                echo -e "${YELLOW}⚠${NC} $BEHIND commits behind origin"
                WARNINGS=$((WARNINGS + 1))
            fi
            
            if [ "$AHEAD" -eq 0 ] && [ "$BEHIND" -eq 0 ]; then
                echo -e "${GREEN}✓${NC} In sync with origin"
            fi
        else
            echo -e "${RED}✗${NC} No remote configured"
            ERRORS=$((ERRORS + 1))
        fi
    fi
else
    echo -e "${RED}✗${NC} Not a git repository"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "================================"
echo "📋 Summary"
echo "================================"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo "You're ready to deploy! 🚀"
    echo ""
    echo "Next steps:"
    echo "  1. Deploy smart contracts: ./scripts/deploy-devnet.sh"
    echo "  2. Deploy API: ./scripts/deploy-api.sh"
    echo "  3. Deploy frontend: ./scripts/deploy-frontend.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) detected${NC}"
    echo "Review warnings above before deploying."
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) detected${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) detected${NC}"
    fi
    echo "Fix errors above before deploying."
    exit 1
fi
