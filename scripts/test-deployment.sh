#!/bin/bash
# Post-deployment testing script for RentBy
# Tests deployed services to ensure they're working correctly

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 RentBy Deployment Testing"
echo "============================"
echo ""

# Get API and Frontend URLs from arguments or use defaults
API_URL=${1:-"https://rentby-api.up.railway.app"}
FRONTEND_URL=${2:-"https://rentby.vercel.app"}

TESTS_PASSED=0
TESTS_FAILED=0

# Function to test an endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $response)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗${NC} (HTTP $response, expected $expected_status)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local name=$1
    local url=$2
    local expected_field=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected_field"; then
        echo -e "${GREEN}✓${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗${NC} (field '$expected_field' not found)"
        echo "Response: $response"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo -e "${BLUE}Testing API:${NC} $API_URL"
echo "----------------------------------------"

# API Health Checks
test_endpoint "Health check" "$API_URL/health"
test_endpoint "Readiness check" "$API_URL/ready"
test_endpoint "Liveness check" "$API_URL/live"

# API Endpoints
test_json_endpoint "Resources list" "$API_URL/api/resources" "resources"
test_json_endpoint "Stats endpoint" "$API_URL/api/stats" "totalResources"
test_json_endpoint "Rentals list" "$API_URL/api/rentals" "rentals"

# Test search endpoint
echo -n "Testing search endpoint... "
search_response=$(curl -s -X POST "$API_URL/api/search" \
    -H "Content-Type: application/json" \
    -d '{"query":"GPU"}')

if echo "$search_response" | grep -q "results"; then
    echo -e "${GREEN}✓${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${BLUE}Testing Frontend:${NC} $FRONTEND_URL"
echo "----------------------------------------"

# Frontend Page Tests
test_endpoint "Home page" "$FRONTEND_URL" 200
test_endpoint "Resources page" "$FRONTEND_URL/resources" 200
test_endpoint "Rentals page" "$FRONTEND_URL/rentals" 200
test_endpoint "Create resource page" "$FRONTEND_URL/create-resource" 200

# Test 404 handling
test_endpoint "404 handling" "$FRONTEND_URL/nonexistent-page" 404

echo ""
echo -e "${BLUE}Testing CORS:${NC}"
echo "----------------------------------------"

echo -n "Testing CORS headers... "
cors_response=$(curl -s -I -X OPTIONS "$API_URL/api/resources" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: GET")

if echo "$cors_response" | grep -qi "access-control-allow-origin"; then
    echo -e "${GREEN}✓${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠${NC} (CORS might not be configured)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo "============================"
echo "📋 Test Summary"
echo "============================"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC} 🎉"
    echo ""
    echo "Your RentBy deployment is working correctly!"
    echo ""
    echo "Next steps:"
    echo "  1. Configure DNS: Point rentby.ai to your deployments"
    echo "  2. Set up SSL certificates (usually automatic with Vercel/Railway)"
    echo "  3. Connect a Solana wallet to test transactions"
    echo "  4. Run end-to-end tests with real blockchain interactions"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo "Review the failures above and check your deployment configuration."
    exit 1
fi
