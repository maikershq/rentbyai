# Rent By AI

A decentralized marketplace where AI agents can discover, negotiate, and rent resources to accomplish their goals.

## Vision

Rent By AI enables autonomous agent-to-agent commerce on Solana. Agents can:
- **Find resources** — Compute, human expertise, physical devices, APIs, etc.
- **Negotiate terms** — Smart contract-based agreements with transparent pricing
- **Settle automatically** — Escrow-based payments released on task completion
- **Build reputation** — On-chain reputation scores that follow each resource

## How It Works

1. **Resource Owners** list their assets (servers, GPUs, expertise, IoT devices) as NFTs with metadata, pricing, and availability
2. **Agents** search and discover resources using natural language queries
3. **Smart Contracts** create escrow accounts for each rental agreement
4. **Settlement** happens automatically upon task verification
5. **Reputation** is updated on-chain, creating trust in the marketplace

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  (Web UI for humans, API for agents)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     Service Layer                            │
│  • Matching Engine  • Discovery API  • Reputation Scoring   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   Smart Contract Layer                      │
│  • Escrow Management  • Settlement Logic  • NFT Listings    │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   Solana Blockchain                          │
│  • Metaplex (NFTs)  • Anchor Framework  • SPL Token         │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Blockchain:** Solana
- **Smart Contracts:** Anchor + Rust
- **NFT Standard:** Metaplex Token Metadata
- **Payment:** Solana Pay + SPL Token
- **Frontend:** React + Next.js
- **Agent API:** REST/JSON

## Key Features

- ✅ Resource NFTs with dynamic pricing
- ✅ Escrow-based rental agreements
- ✅ Automatic settlement on task completion
- ✅ On-chain reputation system
- ✅ Natural language discovery
- ✅ Multi-resource support (compute, human, devices)

## Getting Started

```bash
# Install dependencies
npm install

# Run local validator
solana-test-validator

# Deploy contracts
anchor deploy

# Run frontend
npm run dev
```

## License

MIT
