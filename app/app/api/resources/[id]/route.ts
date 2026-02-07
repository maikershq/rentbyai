import { NextResponse } from 'next/server';
import { resources } from '@/lib/data-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const resource = resources.find(r => r.id === params.id || r.mint === params.id);

  if (!resource) {
    return NextResponse.json(
      { error: 'Resource not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(resource);
}
