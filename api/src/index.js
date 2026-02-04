import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============ In-memory Data Store ============
// In production, this would be a database (PostgreSQL, MongoDB, etc.)
const resources = [];
const rentals = [];

// ============ API Routes ============

// Import health check routes
import healthRoutes from './routes/health.js';
app.use('/', healthRoutes);

/**
 * Search for resources
 * Query params: type, max_price, min_reputation
 */
app.get('/api/resources', (req, res) => {
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

  // Sort by reputation (highest first)
  filtered.sort((a, b) => b.reputation - a.reputation);

  res.json({
    resources: filtered,
    count: filtered.length
  });
});

/**
 * Get a specific resource by ID or mint address
 */
app.get('/api/resources/:id', (req, res) => {
  const resource = resources.find(r => r.id === req.params.id || r.mint === req.params.id);

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  res.json(resource);
});

/**
 * Create a new resource listing
 */
app.post('/api/resources', (req, res) => {
  const {
    owner,
    mint,
    resource_type,
    specs,
    hourly_rate
  } = req.body;

  // Validation
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

/**
 * Get all rentals for a user
 */
app.get('/api/rentals', (req, res) => {
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

/**
 * Get a specific rental
 */
app.get('/api/rentals/:id', (req, res) => {
  const rental = rentals.find(r => r.id === req.params.id);

  if (!rental) {
    return res.status(404).json({ error: 'Rental not found' });
  }

  res.json(rental);
});

/**
 * Create a new rental agreement
 */
app.post('/api/rentals', (req, res) => {
  const {
    renter,
    resource_owner,
    resource_mint,
    escrow_amount,
    duration,
    solana_tx_signature
  } = req.body;

  // Validation
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
    solana_tx_signature,
    created_at: Date.now()
  };

  rentals.push(rental);

  res.status(201).json({
    success: true,
    rental
  });
});

/**
 * Update rental status (complete, dispute, resolve)
 */
app.patch('/api/rentals/:id/status', (req, res) => {
  const { status, solana_tx_signature } = req.body;
  const rental = rentals.find(r => r.id === req.params.id);

  if (!rental) {
    return res.status(404).json({ error: 'Rental not found' });
  }

  const validStatuses = ['active', 'completed', 'disputed', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  rental.status = status;
  if (solana_tx_signature) {
    rental.solana_tx_signature = solana_tx_signature;
  }

  res.json({
    success: true,
    rental
  });
});

/**
 * Get marketplace statistics
 */
app.get('/api/stats', (req, res) => {
  const totalResources = resources.length;
  const totalRentals = rentals.length;
  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const completedRentals = rentals.filter(r => r.status === 'completed').length;

  // Calculate average reputation
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

/**
 * Search resources using natural language
 * Simple keyword matching for now - can be enhanced with AI/ML
 */
app.post('/api/search', (req, res) => {
  const { query, filters } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/);

  // Score each resource based on keyword matches
  const scoredResources = resources.map(resource => {
    let score = 0;
    const searchText = `${resource.resource_type} ${resource.specs}`.toLowerCase();

    keywords.forEach(keyword => {
      if (searchText.includes(keyword)) {
        score += 1;
      }
    });

    // Boost by reputation
    score += resource.reputation * 0.1;

    return { ...resource, score };
  });

  // Filter by score and apply additional filters
  let filtered = scoredResources.filter(r => r.score > 0);

  if (filters) {
    if (filters.type) {
      filtered = filtered.filter(r => r.resource_type === filters.type);
    }
    if (filters.max_price) {
      filtered = filtered.filter(r => r.hourly_rate <= filters.max_price);
    }
    if (filters.min_reputation) {
      filtered = filtered.filter(r => r.reputation >= filters.min_reputation);
    }
  }

  // Sort by score (highest first)
  filtered.sort((a, b) => b.score - a.score);

  res.json({
    query,
    resources: filtered,
    count: filtered.length
  });
});

// ============ Start Server ============
app.listen(PORT, () => {
  console.log(`RentBy API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api`);
});

// Export app for testing
export default app;
