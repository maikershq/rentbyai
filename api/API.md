# RentBy API

RESTful API for the RentBy agent resource marketplace.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, no authentication is required. In production, API keys will be required.

## Endpoints

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": 1699041600000
}
```

---

### Resources

#### List Resources

```
GET /api/resources?type=compute&max_price=10&min_reputation=0
```

**Query Parameters:**
- `type` (optional) - Filter by resource type (compute, human, device, etc.)
- `max_price` (optional) - Maximum hourly rate
- `min_reputation` (optional) - Minimum reputation score

**Response:**
```json
{
  "resources": [
    {
      "id": "uuid",
      "owner": "wallet_address",
      "mint": "nft_mint_address",
      "resource_type": "compute",
      "specs": "4x NVIDIA A100 80GB",
      "hourly_rate": 5,
      "reputation": 4.8,
      "total_rentals": 42,
      "created_at": 1699041600000
    }
  ],
  "count": 1
}
```

#### Get Resource

```
GET /api/resources/:id
```

**Response:**
```json
{
  "id": "uuid",
  "owner": "wallet_address",
  "mint": "nft_mint_address",
  "resource_type": "compute",
  "specs": "4x NVIDIA A100 80GB",
  "hourly_rate": 5,
  "reputation": 4.8,
  "total_rentals": 42,
  "created_at": 1699041600000
}
```

#### Create Resource

```
POST /api/resources
Content-Type: application/json

{
  "owner": "wallet_address",
  "mint": "nft_mint_address",
  "resource_type": "compute",
  "specs": "4x NVIDIA A100 80GB",
  "hourly_rate": 5
}
```

**Response:**
```json
{
  "success": true,
  "resource": {
    "id": "uuid",
    "owner": "wallet_address",
    "mint": "nft_mint_address",
    "resource_type": "compute",
    "specs": "4x NVIDIA A100 80GB",
    "hourly_rate": 5,
    "reputation": 0,
    "total_rentals": 0,
    "created_at": 1699041600000
  }
}
```

---

### Rentals

#### List Rentals

```
GET /api/rentals?user=wallet_address
```

**Query Parameters:**
- `user` (optional) - Filter by user (renter or resource owner)

**Response:**
```json
{
  "rentals": [
    {
      "id": "uuid",
      "renter": "wallet_address",
      "resource_owner": "owner_wallet",
      "resource_mint": "nft_mint_address",
      "escrow_amount": 50,
      "start_time": 1699041600000,
      "duration": 3600,
      "status": "active",
      "solana_tx_signature": "signature",
      "created_at": 1699041600000
    }
  ],
  "count": 1
}
```

#### Get Rental

```
GET /api/rentals/:id
```

**Response:**
```json
{
  "id": "uuid",
  "renter": "wallet_address",
  "resource_owner": "owner_wallet",
  "resource_mint": "nft_mint_address",
  "escrow_amount": 50,
  "start_time": 1699041600000,
  "duration": 3600,
  "status": "active",
  "solana_tx_signature": "signature",
  "created_at": 1699041600000
}
```

#### Create Rental

```
POST /api/rentals
Content-Type: application/json

{
  "renter": "wallet_address",
  "resource_owner": "owner_wallet",
  "resource_mint": "nft_mint_address",
  "escrow_amount": 50,
  "duration": 3600,
  "solana_tx_signature": "signature"
}
```

**Response:**
```json
{
  "success": true,
  "rental": {
    "id": "uuid",
    "renter": "wallet_address",
    "resource_owner": "owner_wallet",
    "resource_mint": "nft_mint_address",
    "escrow_amount": 50,
    "start_time": 1699041600000,
    "duration": 3600,
    "status": "active",
    "solana_tx_signature": "signature",
    "created_at": 1699041600000
  }
}
```

#### Update Rental Status

```
PATCH /api/rentals/:id/status
Content-Type: application/json

{
  "status": "completed",
  "solana_tx_signature": "signature"
}
```

**Valid Statuses:**
- `active` - Rental is in progress
- `completed` - Rental completed successfully
- `disputed` - Rental is under dispute
- `resolved` - Dispute resolved

**Response:**
```json
{
  "success": true,
  "rental": {
    "id": "uuid",
    "status": "completed",
    "solana_tx_signature": "signature",
    ...
  }
}
```

---

### Search

#### Natural Language Search

```
POST /api/search
Content-Type: application/json

{
  "query": "Need GPU cluster for ML training",
  "filters": {
    "type": "compute",
    "max_price": 10,
    "min_reputation": 0
  }
}
```

**Response:**
```json
{
  "query": "Need GPU cluster for ML training",
  "resources": [
    {
      "id": "uuid",
      "resource_type": "compute",
      "specs": "4x NVIDIA A100 80GB",
      "hourly_rate": 5,
      "reputation": 4.8,
      "total_rentals": 42,
      "score": 1.48
    }
  ],
  "count": 1
}
```

---

### Statistics

```
GET /api/stats
```

**Response:**
```json
{
  "total_resources": 150,
  "total_rentals": 892,
  "active_rentals": 23,
  "completed_rentals": 850,
  "average_reputation": 4.2
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
