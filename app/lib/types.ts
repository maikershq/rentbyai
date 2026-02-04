export interface Resource {
  id: string;
  owner: string;
  mint: string;
  resource_type: string;
  specs: string;
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
  status: string;
  solana_tx_signature: string;
  created_at: number;
}

export interface Stats {
  total_resources: number;
  total_rentals: number;
  active_rentals: number;
  completed_rentals: number;
  average_reputation: number;
}
