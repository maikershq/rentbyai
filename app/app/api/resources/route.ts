import { NextRequest, NextResponse } from 'next/server';
import { resources } from '@/lib/data-store';

// GET /api/resources
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type');
  const max_price = searchParams.get('max_price');
  const min_reputation = searchParams.get('min_reputation');

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

  return NextResponse.json({
    resources: filtered,
    count: filtered.length
  });
}

// POST /api/resources
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { owner, mint, resource_type, specs, hourly_rate } = body;

  if (!owner || !mint || !resource_type || !specs || !hourly_rate) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
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

  return NextResponse.json({
    success: true,
    resource
  }, { status: 201 });
}
