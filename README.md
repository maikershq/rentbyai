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

## Project Structure

```
rentbyai/
├── programs/rentbyai/     # Anchor smart contracts
│   └── src/
│       └── lib.rs         # Main contract (rentals, resources)
├── api/                   # REST API for agents
│   ├── src/
│   │   └── index.js       # API server
│   ├── package.json
│   └── API.md            # API documentation
├── docs/                  # Architecture docs
│   └── ARCHITECTURE.md
├── app/                   # Frontend (Next.js) - Coming soon
├── tests/                 # Integration tests - Coming soon
├── README.md
└── .gitignore
```

## Smart Contract Features

The Anchor smart contract (`programs/rentbyai/src/lib.rs`) provides:

- **`create_rental()`** - Lock funds in escrow for a rental agreement
- **`complete_rental()`** - Release funds to resource owner and update reputation
- **`dispute_rental()`** - Dispute a rental (funds locked)
- **`resolve_dispute()`** - Resolve dispute (refund or pay with reputation adjustment)
- **`create_resource()`** - Create on-chain resource metadata with reputation tracking

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | List resources with filters |
| GET | `/api/resources/:id` | Get specific resource |
| POST | `/api/resources` | Create new resource listing |
| GET | `/api/rentals` | List rentals |
| POST | `/api/rentals` | Create rental agreement |
| PATCH | `/api/rentals/:id/status` | Update rental status |
| POST | `/api/search` | Natural language search |
| GET | `/api/stats` | Marketplace statistics |

See [`api/API.md`](api/API.md) for full API documentation.

## Getting Started

### Prerequisites

- Node.js 18+
- Solana CLI
- Anchor Framework
- Git

### Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
```

### Install Anchor

```bash
cargo install git-repair
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Run the API

```bash
cd api
npm install
npm start
```

The API will be available at `http://localhost:3001`

### Deploy Smart Contracts

```bash
# Configure Solana CLI to use devnet
solana config set --url devnet

# Build the contract
anchor build

# Deploy to devnet
anchor deploy

# Run tests
anchor test
```

### Example: Create a Resource

```bash
# Using the API
curl -X POST http://localhost:3001/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "YOUR_WALLET_ADDRESS",
    "mint": "NFT_MINT_ADDRESS",
    "resource_type": "compute",
    "specs": "4x NVIDIA A100 80GB",
    "hourly_rate": 5
  }'
```

### Example: Search for Resources

```bash
# Natural language search
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Need GPU for ML training"
  }'
```

## Development Status

- ✅ Smart contract implementation (Rust + Anchor)
- ✅ REST API implementation (Node.js + Express)
- ✅ API documentation
- ✅ Architecture documentation
- 🚧 Frontend UI (Next.js) - Coming soon
- 🚧 Integration tests - Coming soon
- 🚧 Production deployment - Coming soon

## Roadmap

### Phase 1: Core Platform (Current)
- [x] Smart contract for escrow & rentals
- [x] REST API for resource discovery
- [ ] Basic frontend UI
- [ ] Integration tests
- [ ] Deploy to devnet

### Phase 2: Enhanced Features
- [ ] Natural language embedding search
- [ ] Multi-resource bundle rentals
- [ ] Subscription model for recurring rentals
- [ ] Advanced dispute resolution

### Phase 3: Production Ready
- [ ] Deploy to mainnet
- [ ] Oracle integration for task verification
- [ ] Insurance protocol
- [ ] Cross-chain resource support

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT
