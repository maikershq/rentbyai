import { Resource, Rental, Stats } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getResources(filters?: {
  type?: string;
  max_price?: number;
  min_reputation?: number;
}): Promise<{ resources: Resource[]; count: number }> {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.max_price) params.append('max_price', filters.max_price.toString());
  if (filters?.min_reputation)
    params.append('min_reputation', filters.min_reputation.toString());

  const res = await fetch(`${API_BASE}/resources?${params}`);
  return res.json();
}

export async function getResource(id: string): Promise<Resource> {
  const res = await fetch(`${API_BASE}/resources/${id}`);
  return res.json();
}

export async function createResource(data: {
  owner: string;
  mint: string;
  resource_type: string;
  specs: string;
  hourly_rate: number;
}): Promise<{ success: boolean; resource: Resource }> {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getRentals(user?: string): Promise<{ rentals: Rental[]; count: number }> {
  const params = user ? `?user=${user}` : '';
  const res = await fetch(`${API_BASE}/rentals${params}`);
  return res.json();
}

export async function getRental(id: string): Promise<Rental> {
  const res = await fetch(`${API_BASE}/rentals/${id}`);
  return res.json();
}

export async function createRental(data: {
  renter: string;
  resource_owner: string;
  resource_mint: string;
  escrow_amount: number;
  duration: number;
  solana_tx_signature: string;
}): Promise<{ success: boolean; rental: Rental }> {
  const res = await fetch(`${API_BASE}/rentals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRentalStatus(
  id: string,
  status: string,
  solana_tx_signature: string,
): Promise<{ success: boolean; rental: Rental }> {
  const res = await fetch(`${API_BASE}/rentals/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, solana_tx_signature }),
  });
  return res.json();
}

export async function search(query: string, filters?: {
  type?: string;
  max_price?: number;
  min_reputation?: number;
}): Promise<{ query: string; resources: Resource[]; count: number }> {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, filters }),
  });
  return res.json();
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}
