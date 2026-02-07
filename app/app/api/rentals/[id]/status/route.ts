import { NextRequest, NextResponse } from 'next/server';
import { rentals } from '@/lib/data-store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { status } = body;

  const rental = rentals.find(r => r.id === params.id);

  if (!rental) {
    return NextResponse.json(
      { error: 'Rental not found' },
      { status: 404 }
    );
  }

  const validStatuses = ['active', 'completed', 'disputed', 'resolved'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }

  rental.status = status;

  return NextResponse.json({
    success: true,
    rental
  });
}
