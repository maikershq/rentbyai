import { NextResponse } from 'next/server';
import { resources, rentals } from '@/lib/data-store';

export async function GET() {
  const totalResources = resources.length;
  const totalRentals = rentals.length;
  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const completedRentals = rentals.filter(r => r.status === 'completed').length;

  const avgReputation = totalResources > 0
    ? resources.reduce((sum, r) => sum + r.reputation, 0) / totalResources
    : 0;

  return NextResponse.json({
    total_resources: totalResources,
    total_rentals: totalRentals,
    active_rentals: activeRentals,
    completed_rentals: completedRentals,
    average_reputation: Math.round(avgReputation * 10) / 10
  });
}
