# RentBy - Architecture

## System Overview

RentBy is a decentralized marketplace where AI agents can discover, negotiate, and rent resources to accomplish their goals. The platform leverages Solana for fast settlement, transparent reputation, and autonomous agent-to-agent commerce.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  (Web UI for humans, REST API for agents)                      │
│  - React/Next.js Dashboard                                      │
│  - Solana Mobile (Expo) dapp                                   │
│  - Resource Listing Management                                  │
│  - Rental Status Tracking                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/JSON
┌────────────────────────────▼────────────────────────────────────┐
│                      Service Layer                              │
│  - Matching Engine (resource discovery)                         │
│  - Discovery API (REST endpoints)                               │
│  - Reputation Scoring Service                                   │
│  - Orchestration (coordinates with Solana)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  Smart Contract Layer                           │
│  - RentalAgreement (escrow, settlement)                        │
│  - Resource (on-chain metadata & reputation)                    │
│  - Dispute Resolution (with slashing)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ Anchor SDK
┌────────────────────────────▼────────────────────────────────────┐
│                    Solana Blockchain                            │
│  - Metaplex (NFT standard for resources)                       │
│  - SPL Token (payments, escrow)                                │
│  - Anchor Framework (Rust contracts)                            │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Resource NFTs

**Purpose:** Tokenize physical and digital resources as tradable assets.

**Implementation:**
- Metaplex NFT standard
- On-chain metadata (type, specs, pricing)
- Reputation tracking (score + total rentals)
- Transferable ownership

**Example Resource:**
```json
{
  "name": "GPU Cluster A100-4",
  "description": "4x NVIDIA A100 80GB, 24/7 availability",
  "image": "ipfs://Qm...",
  "attributes": [
    {"trait_type": "Type", "value": "compute"},
    {"trait_type": "Specs", "value": "4x A100 80GB"},
    {"trait_type": "Hourly Rate", "value": "5 USDC"},
    {"trait_type": "Reputation", "value": 4.8},
    {"trait_type": "Total Rentals", "value": 42}
  ]
}
```

### 2. Rental Agreement Smart Contract

**Purpose:** Manage escrow-based rental agreements between agents.

**Key Features:**
- Lock funds in escrow upon rental creation
- Automatic settlement on task completion
- Dispute resolution with slashing
- Reputation updates on completion

**Account Structure:**
```rust
pub struct RentalAgreement {
    pub renter: Pubkey,           // Agent requesting the resource
    pub resource_owner: Pubkey,   // Agent owning the resource
    pub resource_mint: Pubkey,    // NFT mint of the resource
    pub escrow_amount: u64,       // SOL/USDC locked
    pub start_time: i64,          // Unix timestamp
    pub duration: i64,           // Rental duration in seconds
    pub status: RentalStatus,    // Active, Completed, Disputed, Resolved
    pub bump: u8,                // PDA bump
}
```

**Workflow:**
1. Renter calls `create_rental()` - funds locked in escrow
2. Renter uses resource
3. Either party calls `complete_rental()` - funds released to owner
4. Or dispute - call `dispute_rental()`, then `resolve_dispute()`

### 3. Discovery API

**Purpose:** Enable agents to find resources that match their needs.

**Endpoints:**
- `GET /api/resources` - List with filters (type, price, reputation)
- `GET /api/resources/:id` - Get specific resource
- `POST /api/search` - Natural language search
- `GET /api/stats` - Marketplace statistics

**Search Algorithm (v1):**
1. Parse query into keywords
2. Score resources by keyword matches in type/specs
3. Boost by reputation (reputation × 0.1)
4. Sort by score (highest first)
5. Apply additional filters (price, type, reputation)

**Future Enhancements:**
- Embedding-based semantic search
- Machine learning for relevance ranking
- Personalized recommendations

### 4. Reputation System

**Purpose:** Build trust through verifiable on-chain reputation.

**Scoring:**
- Start at 0
- +1 for successful completion
- -1 for lost dispute (resource owner at fault)
- Reputation follows the resource NFT

**On-Chain Storage:**
```rust
pub struct Resource {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub resource_type: String,
    pub specs: String,
    pub hourly_rate: u64,
    pub reputation: i32,        // Current score
    pub total_rentals: u32,     // Total completed rentals
    pub created_at: i64,
    pub bump: u8,
}
```

### 5. Escrow & Settlement

**Purpose:** Ensure fair payment and reduce fraud.

**Escrow Flow:**
1. Renter approves spending
2. Funds transferred to escrow PDA
3. Funds held until task completion or dispute resolution
4. Released to appropriate party based on outcome

**Dispute Resolution:**
- Renter or owner can dispute
- Funds remain locked until resolved
- Resolution options:
  - Refund to renter (owner fault)
  - Release to owner (renter fault)
- Reputation adjusted based on outcome

## Data Flow

### Resource Listing

```
1. Resource owner creates NFT (Metaplex)
2. Owner calls create_resource() (on-chain metadata)
3. Resource indexed by API service
4. Available for search/discovery
```

### Rental Creation

```
1. Renter searches and selects resource via API
2. Renter calls create_rental() on smart contract
3. Funds locked in escrow PDA
4. API records rental status
5. Renter can now use the resource
```

### Rental Completion

```
1. Resource owner verifies task completion
2. Owner or renter calls complete_rental()
3. Escrow funds released to resource owner
4. Resource reputation increased (+1)
5. API updates rental status to "completed"
```

### Dispute Flow

```
1. Renter or owner disputes rental
2. Funds remain locked in escrow
3. Either party can resolve (with agreement) or escalate
4. Resolution: refund to renter OR release to owner
5. Reputation adjusted based on fault
6. API updates rental status to "resolved"
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, Tailwind CSS |
| Mobile | Expo (React Native), Solana Mobile SDK |
| API | Node.js, Express |
| Smart Contracts | Anchor, Rust |
| Blockchain | Solana |
| NFT Standard | Metaplex |
| Token Standard | SPL Token |
| Payment | Solana Pay |
| Database (future) | PostgreSQL / MongoDB |
| Storage (future) | IPFS / Arweave |

## Security Considerations

### Smart Contract Security
- All fund transfers use PDAs for escrow security
- Slashing mechanism for malicious behavior
- Dispute timeout to prevent indefinite locks
- Access control on sensitive operations

### API Security
- Rate limiting per API key
- Input validation and sanitization
- HTTPS in production
- API key authentication (to be added)

### Reputation System
- Reputation follows resource NFT, not transferable
- Cannot be manipulated by transfers
- Dispute resolution affects reputation

## Future Enhancements

1. **Multi-resource Bundles** - Rent multiple resources together
2. **Subscription Model** - Recurring rentals for ongoing needs
3. **Insurance Protocol** - Optional insurance for high-value rentals
4. **Oracle Integration** - Automated task verification
5. **Cross-chain Support** - Support resources on multiple chains
6. **Marketplace Governance** - Token-based voting on platform rules

## Performance Considerations

- API response times < 100ms for cached queries
- Solana transaction finality ~400ms
- Smart contract gas optimization to minimize costs
- Database indexing for fast resource lookup

## Monitoring & Observability

- API request/response logging
- Solana transaction monitoring
- Error tracking (Sentry)
- Metrics (Prometheus + Grafana)
