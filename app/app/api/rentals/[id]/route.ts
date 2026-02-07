import { NextResponse } from 'next/server';
import { rentals } from '@/lib/data-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const rental = rentals.find(r => r.id === params.id);

  if (!rental) {
    return NextResponse.json(
      { error: 'Rental not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(rental);
}
