import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// In-memory data store
const resources = [];
const rentals = [];

// Seed data function
function seedData() {
  if (resources.length === 0) {
    resources.push(
      {
        id: 'gpu-cluster-001',
        owner: '5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x5x',
        mint: 'NFTMint111111111111111111111111111111111111',
        resource_type: 'compute',
        specs: {
          cpu: '16 cores AMD EPYC',
          ram: '64GB DDR4',
          gpu: 'NVIDIA A100 40GB',
          storage: '2TB NVMe SSD'
        },
        hourly_rate: 1.5,
        reputation: 98,
        total_rentals: 42,
        created_at: Date.now()
      },
      {
        id: 'api-service-001',
        owner: '6x6x6x6x6x6x6x6x6x6x6x6x6x6x6x6x6x6x6x6x6x',
        mint: 'NFTMint222222222222222222222222222222222222',
        resource_type: 'api',
        specs: {
          rate_limit: '1000 req/min',
          endpoints: ['/analyze', '/predict', '/embed'],
          auth_type: 'API Key'
        },
        hourly_rate: 0.5,
        reputation: 95,
        total_rentals: 128,
        created_at: Date.now()
      }
    );
  }
}

// Seed on startup
seedData();

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'rentby-api',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    resources: resources.length,
    rentals: rentals.length
  });
});

// Get all resources
app.get('/resources', (req, res) => {
  const { type, max_price, min_reputation } = req.query;

  let filtered = [...resources];

  if (type) {
    filtered = filtered.filter(r => r.resource_type === type);
  }

  if (max_price) {
    filtered = filtered.filter(r => r.hourly_rate <= parseFloat(max_price));
  }

  if (min_reputation) {
    filtered = filtered.filter(r => r.reputation >= parseInt(min_reputation));
  }

  filtered.sort((a, b) => b.reputation - a.reputation);

  res.json({
    resources: filtered,
    count: filtered.length
  });
});

// Get single resource
app.get('/resources/:id', (req, res) => {
  const resource = resources.find(r => r.id === req.params.id || r.mint === req.params.id);

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  res.json(resource);
});

// Create resource
app.post('/resources', (req, res) => {
  const { owner, mint, resource_type, specs, hourly_rate } = req.body;

  if (!owner || !mint || !resource_type || !specs || !hourly_rate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resource = {
    id: crypto.randomUUID(),
    owner,
    mint,
    resource_type,
    specs,
    hourly_rate,
    reputation: 0,
    total_rentals: 0,
    created_at: Date.now()
  };

  resources.push(resource);

  res.status(201).json({
    success: true,
    resource
  });
});

// Get all rentals
app.get('/rentals', (req, res) => {
  const { user } = req.query;

  let filtered = [...rentals];

  if (user) {
    filtered = filtered.filter(r => r.renter === user || r.resource_owner === user);
  }

  res.json({
    rentals: filtered,
    count: filtered.length
  });
});

// Get single rental
app.get('/rentals/:id', (req, res) => {
  const rental = rentals.find(r => r.id === req.params.id);

  if (!rental) {
    return res.status(404).json({ error: 'Rental not found' });
  }

  res.json(rental);
});

// Create rental
app.post('/rentals', (req, res) => {
  const { renter, resource_owner, resource_mint, escrow_amount, duration } = req.body;

  if (!renter || !resource_owner || !resource_mint || !escrow_amount || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const rental = {
    id: crypto.randomUUID(),
    renter,
    resource_owner,
    resource_mint,
    escrow_amount,
    start_time: Date.now(),
    duration,
    status: 'active',
    created_at: Date.now()
  };

  rentals.push(rental);

  res.status(201).json({
    success: true,
    rental
  });
});

// Complete rental
app.post('/rentals/:id/complete', (req, res) => {
  const rental = rentals.find(r => r.id === req.params.id);

  if (!rental) {
    return res.status(404).json({ error: 'Rental not found' });
  }

  rental.status = 'completed';
  rental.completed_at = Date.now();

  res.json({
    success: true,
    message: 'Rental completed successfully',
    rental
  });
});

// Update rental status
app.patch('/rentals/:id/status', (req, res) => {
  const { status } = req.body;
  const rental = rentals.find(r => r.id === req.params.id);

  if (!rental) {
    return res.status(404).json({ error: 'Rental not found' });
  }

  const validStatuses = ['active', 'completed', 'disputed', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  rental.status = status;

  res.json({
    success: true,
    rental
  });
});

// Get stats
app.get('/stats', (req, res) => {
  const totalResources = resources.length;
  const totalRentals = rentals.length;
  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const completedRentals = rentals.filter(r => r.status === 'completed').length;

  const avgReputation = totalResources > 0
    ? resources.reduce((sum, r) => sum + r.reputation, 0) / totalResources
    : 0;

  res.json({
    total_resources: totalResources,
    total_rentals: totalRentals,
    active_rentals: activeRentals,
    completed_rentals: completedRentals,
    average_reputation: Math.round(avgReputation * 10) / 10
  });
});

// Natural language search
app.post('/search', (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/);

  const scoredResources = resources.map(resource => {
    let score = 0;
    const searchText = `${resource.resource_type} ${JSON.stringify(resource.specs)}`.toLowerCase();

    keywords.forEach(keyword => {
      if (searchText.includes(keyword)) {
        score += 1;
      }
    });

    score += resource.reputation / 100;

    return { ...resource, score };
  });

  const results = scoredResources
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  res.json({
    results,
    query,
    count: results.length
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// For Vercel serverless - export the Express app
export default app;

// For local development - start server
if (process.env.NODE_ENV !== 'vercel') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`RentBy API running on port ${PORT}`);
  });
}
