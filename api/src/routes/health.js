const express = require('express');
const router = express.Router();

/**
 * Health check endpoint for monitoring
 * Returns service status and basic metrics
 */
router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    network: process.env.SOLANA_NETWORK || 'devnet',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  };

  res.status(200).json(health);
});

/**
 * Readiness check endpoint
 * Returns 200 if service is ready to accept traffic
 */
router.get('/ready', (req, res) => {
  // Add checks for dependencies (database, Solana RPC, etc.)
  const ready = {
    status: 'ready',
    checks: {
      api: true,
      // Add more checks as needed:
      // database: await checkDatabase(),
      // solana: await checkSolanaConnection(),
    }
  };

  const allReady = Object.values(ready.checks).every(check => check === true);
  
  res.status(allReady ? 200 : 503).json(ready);
});

/**
 * Liveness check endpoint
 * Returns 200 if process is alive
 */
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
