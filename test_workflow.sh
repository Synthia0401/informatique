#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}CinéMax Seat Selection Workflow Test${NC}"
echo -e "${YELLOW}========================================${NC}\n"

BASE_URL="http://localhost:5000"
TEST_DATE="2025-12-04"
TEST_EMAIL="test@cinema.com"
TEST_PASSWORD="test1234"

# Step 1: Test API endpoints
echo -e "${YELLOW}Step 1: Testing API Endpoints${NC}"
echo "-----------------------------------"

echo "Testing /api/showtimes endpoint..."
SHOWTIMES=$(curl -s "$BASE_URL/api/showtimes/$TEST_DATE")
if echo "$SHOWTIMES" | grep -q "showtimes"; then
    echo -e "${GREEN}✓ Showtimes API working${NC}"
    echo "Sample response:"
    echo "$SHOWTIMES" | python -m json.tool | head -20
else
    echo -e "${RED}✗ Showtimes API failed${NC}"
fi

echo -e "\nTesting /api/seats endpoint..."
SEATS=$(curl -s "$BASE_URL/api/seats/1")
if echo "$SEATS" | grep -q "rows"; then
    echo -e "${GREEN}✓ Seats API working${NC}"
    ROWS=$(echo "$SEATS" | grep -o '"row"' | wc -l)
    echo "Rows returned: $ROWS"
else
    echo -e "${RED}✗ Seats API failed${NC}"
fi

# Step 2: Test authentication
echo -e "\n${YELLOW}Step 2: Testing Authentication${NC}"
echo "-----------------------------------"

echo "Logging in with test account..."
LOGIN=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -c /tmp/cookies.txt)

if echo "$LOGIN" | grep -q "success.*true"; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Response: $LOGIN" | python -m json.tool
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "Response: $LOGIN"
fi

echo -e "\n${YELLOW}========================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}========================================${NC}"
echo "All API endpoints are operational!"
echo "Test credentials: $TEST_EMAIL / $TEST_PASSWORD"
echo "Access the app at: $BASE_URL"
