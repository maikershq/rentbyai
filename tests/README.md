# RentBy - Testing Guide

This directory contains integration tests for the RentBy smart contracts.

## Prerequisites

Before running tests, ensure you have the following installed:

### 1. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

Configure for local testing:

```bash
solana config set --url localhost
```

### 3. Install Anchor Framework

```bash
cargo install git-repair
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### 4. Install Node.js Dependencies

```bash
cd /path/to/rentby
npm install
```

## Test Suite Overview

The test suite (`rentby.ts`) covers all major smart contract functions:

### Test Cases

1. **Creates a new resource**
   - Verifies resource PDA creation
   - Validates on-chain metadata
   - Checks initial reputation (0) and rentals (0)

2. **Creates a rental agreement with escrow**
   - Transfers tokens from renter to escrow PDA
   - Validates rental account structure
   - Confirms escrow balance

3. **Completes a rental and releases escrow**
   - Releases funds to resource owner
   - Updates resource reputation (+1)
   - Increments total rentals

4. **Creates and disputes a rental**
   - Validates dispute status
   - Ensures escrow remains locked

5. **Resolves dispute by refunding to renter**
   - Returns escrow to renter
   - Decreases resource reputation (-1)

6. **Resolves dispute by paying owner**
   - Releases escrow to owner
   - Increases resource reputation (+1)

## Running Tests

### Local Validator

Start a local Solana validator:

```bash
solana-test-validator
```

### Run All Tests

In a new terminal:

```bash
anchor test
```

Or with more verbose output:

```bash
anchor test -- --nocapture
```

### Run Specific Test

```bash
anchor test --skip "skip this test name"
```

## Test Coverage

- ✅ Resource creation (metadata, pricing)
- ✅ Rental creation (escrow lock)
- ✅ Rental completion (fund release + reputation)
- ✅ Dispute initiation (fund lock)
- ✅ Dispute resolution (refund or payment)
- ✅ Reputation system (increase/decrease)

## Smart Contract Functions Tested

| Function | Test Case |
|----------|-----------|
| `create_resource()` | Creates a new resource |
| `create_rental()` | Creates a rental agreement with escrow |
| `complete_rental()` | Completes a rental and releases escrow |
| `dispute_rental()` | Creates and disputes a rental |
| `resolve_dispute()` | Resolves disputes (refund/pay owner) |

## Troubleshooting

### "anchor: command not found"

Install Anchor:

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### "program not deployed"

Build the program first:

```bash
anchor build
```

### "Transaction simulation failed"

Ensure the local validator is running:

```bash
solana-test-validator
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Anchor Tests
  run: |
    solana-test-validator &
    sleep 5
    anchor test --skip-local-validator
```

## Next Steps

- [ ] Add more edge case tests
- [ ] Add stress tests for high-volume scenarios
- [ ] Test multi-resource rentals
- [ ] Add integration tests with frontend
- [ ] Add API contract tests
