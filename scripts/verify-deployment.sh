#!/bin/bash
# Post-Deployment Verification Script
# Run this after deploying API and/or Frontend to verify everything works

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BOLD}🔍 RentBy Deployment Verification${NC}\n"

# Function to check URL
check_url() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $name... "
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $status_code)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $status_code, expected $expected_status)"
        return 1
    fi
}

# Function to check JSON endpoint
check_json_endpoint() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | jq . >/dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC} (Valid JSON)"
        echo "  Response: $response" | head -c 200
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Invalid JSON)"
        echo "  Response: $response" | head -c 200
        return 1
    fi
}

# Get URLs from user
if [ -z "$API_URL" ]; then
    echo -e "${YELLOW}Enter API URL (or press Enter to skip):${NC}"
    read -r API_URL
fi

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${YELLOW}Enter Frontend URL (or press Enter to skip):${NC}"
    read -r FRONTEND_URL
fi

echo ""
failed=0

# API Tests
if [ -n "$API_URL" ]; then
    echo -e "${BOLD}📡 API Tests${NC}"
    
    # Health check
    check_url "${API_URL}/health" "Health endpoint" || ((failed++))
    
    # Resources endpoint
    check_json_endpoint "${API_URL}/api/resources" "Resources list" || ((failed++))
    
    # Rentals endpoint
    check_json_endpoint "${API_URL}/api/rentals" "Rentals list" || ((failed++))
    
    # Stats endpoint
    check_json_endpoint "${API_URL}/api/stats" "Statistics" || ((failed++))
    
    # CORS test
    echo -n "Checking CORS headers... "
    cors_header=$(curl -s -I -X OPTIONS "$API_URL/api/resources" | grep -i "access-control-allow-origin" || echo "")
    if [ -n "$cors_header" ]; then
        echo -e "${GREEN}✓ OK${NC}"
        echo "  $cors_header"
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (No CORS headers found)"
    fi
    
    echo ""
fi

# Frontend Tests
if [ -n "$FRONTEND_URL" ]; then
    echo -e "${BOLD}🎨 Frontend Tests${NC}"
    
    # Homepage
    check_url "$FRONTEND_URL" "Homepage" || ((failed++))
    
    # Resources page
    check_url "${FRONTEND_URL}/resources" "Resources page" || ((failed++))
    
    # Rentals page
    check_url "${FRONTEND_URL}/rentals" "Rentals page" || ((failed++))
    
    # Create resource page
    check_url "${FRONTEND_URL}/create-resource" "Create resource page" || ((failed++))
    
    # Check if API_URL is embedded in the frontend
    echo -n "Checking API configuration... "
    frontend_html=$(curl -s "$FRONTEND_URL")
    if echo "$frontend_html" | grep -q "$API_URL"; then
        echo -e "${GREEN}✓ OK${NC} (API URL found in frontend)"
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (API URL not found - check NEXT_PUBLIC_API_URL)"
    fi
    
    echo ""
fi

# Integration Test (if both URLs provided)
if [ -n "$API_URL" ] && [ -n "$FRONTEND_URL" ]; then
    echo -e "${BOLD}🔗 Integration Test${NC}"
    
    echo -n "Testing API → Frontend flow... "
    
    # Create a test resource via API
    test_resource=$(cat <<EOF
{
  "name": "Verification Test GPU",
  "type": "gpu",
  "description": "Auto-generated test resource",
  "price": 1.0,
  "available": true
}
EOF
)
    
    create_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$test_resource" \
        "${API_URL}/api/resources")
    
    if echo "$create_response" | jq -e '.id' >/dev/null 2>&1; then
        resource_id=$(echo "$create_response" | jq -r '.id')
        echo -e "${GREEN}✓ OK${NC} (Created resource ID: $resource_id)"
        
        # Try to fetch it
        echo -n "Verifying resource retrieval... "
        get_response=$(curl -s "${API_URL}/api/resources/${resource_id}")
        if echo "$get_response" | jq -e '.id' >/dev/null 2>&1; then
            echo -e "${GREEN}✓ OK${NC}"
        else
            echo -e "${RED}✗ FAILED${NC}"
            ((failed++))
        fi
    else
        echo -e "${YELLOW}⚠ SKIPPED${NC} (Could not create test resource)"
    fi
    
    echo ""
fi

# Summary
echo -e "${BOLD}📊 Summary${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✓ All checks passed!${NC}"
    echo ""
    echo "🎉 Your RentBy deployment is working correctly!"
    echo ""
    if [ -n "$API_URL" ]; then
        echo "API:      $API_URL"
    fi
    if [ -n "$FRONTEND_URL" ]; then
        echo "Frontend: $FRONTEND_URL"
    fi
    echo ""
    echo "Next steps:"
    echo "1. Test the UI manually in your browser"
    echo "2. Connect a Solana wallet (Phantom/Solflare)"
    echo "3. Deploy smart contracts when ready"
    echo "4. Update DNS for rentby.ai domain"
    exit 0
else
    echo -e "${RED}${BOLD}✗ $failed check(s) failed${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Check deployment logs for errors"
    echo "2. Verify environment variables are set correctly"
    echo "3. Ensure CORS is configured properly"
    echo "4. Check if services are fully started (may take 2-3 min)"
    echo ""
    echo "For detailed logs:"
    if [ -n "$API_URL" ]; then
        echo "  curl ${API_URL}/health"
    fi
    exit 1
fi
