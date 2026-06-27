import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchPexelsPhotos } from '@/lib/pexels';

const querySchema = z.object({
  query: z.string().min(1).max(100),
  count: z.coerce.number().int().min(1).max(10).default(4),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    query: searchParams.get('query') ?? '',
    count: searchParams.get('count') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ photos: [] }, { status: 400 });
  }

  const photos = await searchPexelsPhotos(parsed.data.query, parsed.data.count);

  return NextResponse.json(
    { photos },
    { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } }
  );
}
