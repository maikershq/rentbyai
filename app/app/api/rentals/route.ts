import { NextRequest, NextResponse } from 'next/server';
import { rentals } from '@/lib/data-store';

// GET /api/rentals
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');

  let filtered = [...rentals];

  if (user) {
    filtered = filtered.filter(r => r.renter === user || r.resource_owner === user);
  }

  return NextResponse.json({
    rentals: filtered,
    count: filtered.length
  });
}

// POST /api/rentals
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { renter, resource_owner, resource_mint, escrow_amount, duration } = body;

  if (!renter || !resource_owner || !resource_mint || !escrow_amount || !duration) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const rental = {
    id: crypto.randomUUID(),
    renter,
    resource_owner,
    resource_mint,
    escrow_amount,
    start_time: Date.now(),
    duration,
    status: 'active' as const,
    created_at: Date.now()
  };

  rentals.push(rental);

  return NextResponse.json({
    success: true,
    rental
  }, { status: 201 });
}
