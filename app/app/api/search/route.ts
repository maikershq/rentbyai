import { NextRequest, NextResponse } from 'next/server';
import { resources, Resource } from '@/lib/data-store';

interface ScoredResource extends Resource {
  score: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query } = body;

  if (!query) {
    return NextResponse.json(
      { error: 'Query is required' },
      { status: 400 }
    );
  }

  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/);

  const scoredResources: ScoredResource[] = resources.map((resource: Resource) => {
    let score = 0;
    const searchText = `${resource.resource_type} ${JSON.stringify(resource.specs)}`.toLowerCase();

    keywords.forEach(keyword => {
      if (searchText.includes(keyword)) {
        score += 1;
      }
    });

    score += resource.reputation / 100;

    return { ...resource, score };
  });

  const results = scoredResources
    .filter((r: ScoredResource) => r.score > 0)
    .sort((a: ScoredResource, b: ScoredResource) => b.score - a.score);

  return NextResponse.json({
    results,
    query,
    count: results.length
  });
}
