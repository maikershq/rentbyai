// In-memory data store for API
// Note: This persists during the Vercel function lifecycle but resets on cold starts

export interface Resource {
  id: string;
  owner: string;
  mint: string;
  resource_type: string;
  specs: Record<string, any>;
  hourly_rate: number;
  reputation: number;
  total_rentals: number;
  created_at: number;
}

export interface Rental {
  id: string;
  renter: string;
  resource_owner: string;
  resource_mint: string;
  escrow_amount: number;
  start_time: number;
  duration: number;
  status: 'active' | 'completed' | 'disputed' | 'resolved';
  created_at: number;
  completed_at?: number;
}

export const resources: Resource[] = [
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
];

export const rentals: Rental[] = [];
