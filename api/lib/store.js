// Shared in-memory data store for serverless functions
// Note: Data resets on each deployment/cold start

export const resources = [];
export const rentals = [];

// Seed with some sample data for demo purposes
export function seedData() {
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
