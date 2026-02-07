import { NextResponse } from 'next/server';
import { resources, rentals } from '@/lib/data-store';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    resources: resources.length,
    rentals: rentals.length
  });
}
