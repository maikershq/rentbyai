# RentBy API - Testing Guide

This directory contains integration tests for the RentBy REST API.

## Prerequisites

Before running tests, ensure you have the following installed:

- Node.js 18+
- npm

## Installation

```bash
cd api
npm install
```

## Test Suite Overview

The test suite (`tests/api.test.js`) covers all API endpoints:

### Test Categories

#### 1. Health Check
- `GET /health` - Verifies API is running

#### 2. Resources
- **POST /api/resources**
  - Creates a new resource listing
  - Validates required fields
  - Returns 201 on success

- **GET /api/resources**
  - Returns all resources
  - Filters by type, max_price, min_reputation
  - Sorts by reputation (highest first)

- **GET /api/resources/:id**
  - Returns specific resource by ID
  - Returns 404 for non-existent resources

#### 3. Rentals
- **POST /api/rentals**
  - Creates a new rental agreement
  - Validates required fields
  - Returns 201 on success

- **GET /api/rentals**
  - Returns all rentals
  - Filters by user (renter or owner)

- **GET /api/rentals/:id**
  - Returns specific rental by ID
  - Returns 404 for non-existent rentals

- **PATCH /api/rentals/:id/status**
  - Updates rental status
  - Validates status values
  - Returns 404 for non-existent rentals

#### 4. Search
- **POST /api/search**
  - Natural language search
  - Applies filters (type, price, reputation)
  - Sorts by relevance score

#### 5. Statistics
- **GET /api/stats**
  - Returns marketplace statistics
  - Includes totals and averages

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Integration Tests

```bash
npm run test:integration
```

### Run with Coverage

```bash
npm run test:integration -- --coverage
```

### Run Specific Test File

```bash
npm run test:integration -- tests/api.test.js
```

## Test Coverage Goals

We aim for at least 70% coverage across all endpoints:

- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%
- **Statements:** 70%

Current coverage report is generated in the `coverage/` directory.

## API Endpoints Tested

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/health` | ✅ |
| POST | `/api/resources` | ✅ |
| GET | `/api/resources` | ✅ |
| GET | `/api/resources/:id` | ✅ |
| POST | `/api/rentals` | ✅ |
| GET | `/api/rentals` | ✅ |
| GET | `/api/rentals/:id` | ✅ |
| PATCH | `/api/rentals/:id/status` | ✅ |
| POST | `/api/search` | ✅ |
| GET | `/api/stats` | ✅ |

## Test Data

Tests use in-memory data that is reset between test runs. No external database is required for testing.

### Example Test Resource

```json
{
  "owner": "test_wallet_address",
  "mint": "test_mint_address",
  "resource_type": "compute",
  "specs": "8x NVIDIA H100 80GB",
  "hourly_rate": 10,
  "reputation": 0,
  "total_rentals": 0
}
```

### Example Test Rental

```json
{
  "renter": "test_renter_wallet",
  "resource_owner": "resource_owner_wallet",
  "resource_mint": "resource_mint_1",
  "escrow_amount": 50,
  "duration": 3600,
  "status": "active"
}
```

## Troubleshooting

### "Cannot find module 'supertest'"

Install dependencies:

```bash
npm install
```

### "Port already in use"

Stop the API server if running:

```bash
# Find the process
lsof -i :3001

# Kill it
kill -9 <PID>
```

### Tests timing out

Increase timeout in `jest.config.json`:

```json
{
  "testTimeout": 30000
}
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run API Tests
  run: |
    cd api
    npm install
    npm run test:integration
```

## Mocking External Services

The API currently uses in-memory storage. When integrating with Solana blockchain, you'll need to:

1. Mock `@solana/web3.js` calls
2. Use a local validator for integration tests
3. Mock Metaplex NFT metadata queries

Example with a local validator:

```javascript
beforeAll(async () => {
  // Start local Solana validator
  // Or use mocked responses
});
```

## Next Steps

- [ ] Add tests for error edge cases
- [ ] Add tests for concurrent requests
- [ ] Add performance/load tests
- [ ] Add tests for Solana integration
- [ ] Add contract testing with actual smart contracts
- [ ] Add E2E tests with frontend

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [API Documentation](./API.md)
