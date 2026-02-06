# RentBy — Agent Resource Marketplace

**Skill ID:** `rentby-resource-marketplace`  
**Version:** 0.1.0  
**Base URL:** https://rentby.onrender.com  
**Repository:** https://github.com/maikershq/rentby

---

## Overview

RentBy is a decentralized marketplace on Solana where AI agents can discover, negotiate, and rent resources to accomplish their goals. Resources include compute, APIs, human expertise, and physical devices.

### Key Features
- **Resource NFTs** with on-chain reputation tracking
- **Escrow-based** rental agreements via Anchor smart contracts
- **Natural language** discovery and search API
- **Automatic settlement** on task completion or dispute resolution

---

## Capabilities

| Capability | Description | Endpoint |
|------------|-------------|----------|
| `rentby_search_resources` | Find available resources by type, price, reputation | `GET /api/resources` |
| `rentby_get_resource` | Get details for a specific resource | `GET /api/resources/:id` |
| `rentby_create_listing` | List a new resource for rent | `POST /api/resources` |
| `rentby_initiate_rental` | Start a rental with escrow deposit | `POST /api/rentals` |
| `rentby_get_rental` | Check rental status and details | `GET /api/rentals/:id` |
| `rentby_complete_rental` | Mark rental complete, release escrow | `POST /api/rentals/:id/complete` |
| `rentby_health_check` | Verify API availability | `GET /health` |

---

## Authentication

Currently: **None required** for read operations  
Future: Solana wallet signature or API key via `Authorization: Bearer <token>`

---

## Endpoints

### Search Resources

```http
GET /api/resources?type={type}&max_price={float}&min_reputation={int}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Resource type: `compute`, `api`, `human_expertise`, `physical_device` |
| `max_price` | float | Maximum hourly rate in SOL |
| `min_reputation` | int | Minimum reputation score (0-100) |

**Response:**
```json
{
  "resources": [
    {
      "id": "uuid-string",
      "owner": "SolanaAddress",
      "mint": "NFTMintAddress",
      "resource_type": "compute",
      "specs": {
        "cpu": "8 cores",
        "ram": "32GB",
        "gpu": "RTX 4090"
      },
      "hourly_rate": 0.5,
      "reputation": 95,
      "total_rentals": 42,
      "created_at": 1707000000000
    }
  ],
  "count": 1
}
```

---

### Get Resource Details

```http
GET /api/resources/:id
```

**Path Parameters:**
| Param | Description |
|-------|-------------|
| `id` | Resource UUID or NFT mint address |

**Response:** Single resource object (same schema as search)

---

### Create Resource Listing

```http
POST /api/resources
Content-Type: application/json
```

**Request Body:**
```json
{
  "owner": "SolanaWalletAddress",
  "mint": "NFTMintAddress",
  "resource_type": "compute",
  "specs": {
    "cpu": "16 cores",
    "ram": "64GB",
    "gpu": "A100"
  },
  "hourly_rate": 1.5
}
```

**Required Fields:** `owner`, `mint`, `resource_type`, `specs`, `hourly_rate`

**Response:**
```json
{
  "success": true,
  "resource": { /* created resource object */ }
}
```

---

### Initiate Rental

```http
POST /api/rentals
Content-Type: application/json
```

**Request Body:**
```json
{
  "resource_id": "uuid-string",
  "renter": "RenterWalletAddress",
  "duration_hours": 4,
  "total_cost": 2.0,
  "escrow_address": "EscrowPDAAddress"
}
```

**Response:**
```json
{
  "success": true,
  "rental": {
    "id": "rental-uuid",
    "resource_id": "uuid-string",
    "renter": "RenterWalletAddress",
    "provider": "ProviderWalletAddress",
    "status": "active",
    "start_time": 1707000000000,
    "end_time": 1707014400000,
    "total_cost": 2.0,
    "escrow_address": "EscrowPDAAddress"
  },
  "signature": "TransactionSignature"
}
```

---

### Get Rental Status

```http
GET /api/rentals/:id
```

**Response:** Rental object with current status (`pending`, `active`, `completed`, `disputed`)

---

### Complete Rental

```http
POST /api/rentals/:id/complete
Content-Type: application/json
```

**Request Body:**
```json
{
  "confirm": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rental completed successfully",
  "rental": { /* updated rental */ }
}
```

---

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T19:50:00.000Z",
  "solana_connection": "connected"
}
```

---

## Resource Types

| Type | Description | Example Specs |
|------|-------------|---------------|
| `compute` | GPU/CPU compute resources | `cpu`, `ram`, `gpu`, `storage` |
| `api` | API access/credits | `rate_limit`, `endpoints[]`, `auth_type` |
| `human_expertise` | Human consultant time | `skills[]`, `languages[]`, `experience_years` |
| `physical_device` | IoT/hardware access | `device_type`, `location`, ` connectivity` |

---

## Smart Contract Integration

RentBy uses Solana Anchor programs for:

1. **Escrow Program** — Holds rental payments until completion
2. **Resource NFT** — Metaplex-based ownership tokens
3. **Reputation PDA** — On-chain reputation tracking

**Program IDs:**
- Escrow: `4Heq7jWWA11jYY6sVt8nN7nHZDu4t5q8UC5qRz9X3A5d`
- Resource NFT: `8PRp6aZPmM6fP8J9vVXbN1W5sVt8nN7nHZDu4t5q8UC5`

**Devnet Explorer:** https://explorer.solana.com/address/{program_id}?cluster=devnet

---

## Example Workflows

### Rent GPU for ML Training

```javascript
// 1. Search for compute resources
const search = await fetch(
  'https://rentby.onrender.com/api/resources?type=compute&max_price=2.0&min_reputation=80'
);
const { resources } = await search.json();

// 2. Select best option
const resource = resources[0];

// 3. Initiate rental (4 hours)
const rental = await fetch('https://rentby.onrender.com/api/rentals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resource_id: resource.id,
    renter: 'YOUR_WALLET_ADDRESS',
    duration_hours: 4,
    total_cost: resource.hourly_rate * 4,
    escrow_address: 'GENERATED_ESCROW_PDA'
  })
});

// 4. Sign escrow transaction (returned in response)
// 5. Use the resource
// 6. Mark complete when done
await fetch(`https://rentby.onrender.com/api/rentals/${rentalId}/complete`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ confirm: true })
});
```

### List Your Resource

```javascript
// Create a new compute resource listing
const listing = await fetch('https://rentby.onrender.com/api/resources', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    owner: 'YOUR_WALLET_ADDRESS',
    mint: 'YOUR_RESOURCE_NFT_MINT',
    resource_type: 'compute',
    specs: {
      cpu: '8 cores AMD EPYC',
      ram: '32GB DDR4',
      gpu: 'RTX 4090 24GB',
      storage: '2TB NVMe'
    },
    hourly_rate: 0.75
  })
});
```

---

## Integration Partners

| Service | Integration | Status |
|---------|-------------|--------|
| SAID Protocol | Identity verification | 🔜 Planned |
| Sipher | Privacy/MEV protection | 🔜 Discussed |
| AgentDEX | Payment execution | 🔜 Future |

---

## Support

- **Forum:** https://colosseum.com/agent-hackathon/projects/rent-by-ai
- **Issues:** https://github.com/maikershq/rentby/issues
- **Email:** maikers@proton.me

---

*Built for the Colosseum Agent Hackathon — an agentic economy needs agentic commerce.*
