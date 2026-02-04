#!/bin/bash
# Deployment status monitoring script for RentBy
# Checks the status of all deployed services

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 RentBy Deployment Status${NC}"
echo "============================"
date
echo ""

# Service URLs (update these after deployment)
API_URL=${API_URL:-"https://rentby-api.up.railway.app"}
FRONTEND_URL=${FRONTEND_URL:-"https://rentby.vercel.app"}
DOMAIN=${DOMAIN:-"https://rentby.ai"}

# Function to check service status
check_service() {
    local name=$1
    local url=$2
    local health_endpoint=${3:-"/health"}
    
    echo -e "${BLUE}$name${NC}"
    echo "URL: $url"
    echo -n "Status: "
    
    # Check if service is reachable
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url$health_endpoint" 2>&1); then
        if [ "$response" = "200" ]; then
            echo -e "${GREEN}✓ Online${NC}"
            
            # Try to get additional info
            if [ "$health_endpoint" = "/health" ]; then
                health_data=$(curl -s "$url$health_endpoint" 2>/dev/null || echo "{}")
                if echo "$health_data" | grep -q "status"; then
                    status=$(echo "$health_data" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
                    uptime=$(echo "$health_data" | grep -o '"uptime":[0-9]*' | cut -d':' -f2)
                    
                    if [ -n "$status" ]; then
                        echo "  Service status: $status"
                    fi
                    
                    if [ -n "$uptime" ]; then
                        # Convert uptime to human readable
                        uptime_hours=$((uptime / 3600))
                        uptime_mins=$(((uptime % 3600) / 60))
                        echo "  Uptime: ${uptime_hours}h ${uptime_mins}m"
                    fi
                fi
            fi
            
            # Check response time
            response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url$health_endpoint" 2>/dev/null || echo "N/A")
            if [ "$response_time" != "N/A" ]; then
                echo "  Response time: ${response_time}s"
            fi
            
            return 0
        else
            echo -e "${YELLOW}⚠ Reachable but unhealthy${NC} (HTTP $response)"
            return 1
        fi
    else
        echo -e "${RED}✗ Offline or unreachable${NC}"
        return 1
    fi
}

# Function to check domain DNS
check_dns() {
    local domain=$1
    echo -e "${BLUE}Domain DNS${NC}"
    echo "Domain: $domain"
    echo -n "DNS Status: "
    
    if host "${domain#https://}" &> /dev/null; then
        ip=$(host "${domain#https://}" | grep "has address" | awk '{print $4}' | head -n 1)
        if [ -n "$ip" ]; then
            echo -e "${GREEN}✓ Resolved${NC} ($ip)"
            return 0
        fi
    fi
    
    echo -e "${YELLOW}⚠ Not configured or pending propagation${NC}"
    return 1
}

# Function to check GitHub repo
check_github() {
    local repo=$1
    echo -e "${BLUE}GitHub Repository${NC}"
    echo "Repo: $repo"
    
    # Check if we can access GitHub
    if git ls-remote "$repo" &> /dev/null; then
        echo -e "Status: ${GREEN}✓ Accessible${NC}"
        
        # Get latest commit
        latest_commit=$(git ls-remote "$repo" HEAD | awk '{print $1}' | cut -c1-7)
        echo "  Latest commit: $latest_commit"
        
        # Check local vs remote
        if [ -d ".git" ]; then
            local_commit=$(git rev-parse HEAD | cut -c1-7)
            if [ "$local_commit" = "$latest_commit" ]; then
                echo -e "  Local sync: ${GREEN}✓ Up to date${NC}"
            else
                echo -e "  Local sync: ${YELLOW}⚠ Out of sync${NC}"
                echo "    Local: $local_commit"
                echo "    Remote: $latest_commit"
            fi
        fi
        
        return 0
    else
        echo -e "Status: ${RED}✗ Not accessible${NC}"
        return 1
    fi
}

# Function to get API stats
get_api_stats() {
    local api_url=$1
    echo -e "${BLUE}API Statistics${NC}"
    
    if stats=$(curl -s "$api_url/api/stats" 2>/dev/null); then
        if echo "$stats" | grep -q "totalResources"; then
            total_resources=$(echo "$stats" | grep -o '"totalResources":[0-9]*' | cut -d':' -f2)
            total_rentals=$(echo "$stats" | grep -o '"totalRentals":[0-9]*' | cut -d':' -f2)
            active_rentals=$(echo "$stats" | grep -o '"activeRentals":[0-9]*' | cut -d':' -f2)
            
            echo "  Total Resources: $total_resources"
            echo "  Total Rentals: $total_rentals"
            echo "  Active Rentals: $active_rentals"
            return 0
        fi
    fi
    
    echo -e "  ${YELLOW}⚠ Could not fetch statistics${NC}"
    return 1
}

echo -e "${CYAN}Services${NC}"
echo "----------------------------------------"
check_service "API Server" "$API_URL" "/health"
echo ""
check_service "Frontend" "$FRONTEND_URL" "/"
echo ""

echo -e "${CYAN}Domain${NC}"
echo "----------------------------------------"
check_dns "$DOMAIN"
echo ""

echo -e "${CYAN}Repository${NC}"
echo "----------------------------------------"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "Not configured")
check_github "$REPO_URL"
echo ""

echo -e "${CYAN}Data${NC}"
echo "----------------------------------------"
get_api_stats "$API_URL"
echo ""

echo -e "${CYAN}Environment${NC}"
echo "----------------------------------------"
echo -e "${BLUE}API Environment${NC}"
if [ -f ".env" ] || [ -f "api/.env" ]; then
    echo -e "  ${GREEN}✓${NC} Environment file exists"
else
    echo -e "  ${YELLOW}⚠${NC} No .env file found (using .env.example as reference)"
fi

echo ""
echo -e "${BLUE}Frontend Environment${NC}"
if [ -f "app/.env.local" ] || [ -f "app/.env.production" ]; then
    echo -e "  ${GREEN}✓${NC} Environment file exists"
else
    echo -e "  ${YELLOW}⚠${NC} No .env file found (using .env.example as reference)"
fi

echo ""
echo "============================"
echo -e "${CYAN}Quick Links${NC}"
echo "============================"
echo "  API Health: $API_URL/health"
echo "  API Docs: $API_URL/api"
echo "  Frontend: $FRONTEND_URL"
if [ "$DOMAIN" != "$FRONTEND_URL" ]; then
    echo "  Production: $DOMAIN"
fi
echo ""
echo "  Railway Dashboard: https://railway.app/dashboard"
echo "  Vercel Dashboard: https://vercel.com/dashboard"
echo "  GitHub Repo: https://github.com/maikershq/rentby"
echo ""
