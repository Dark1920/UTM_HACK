import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/avis
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const is_spam = searchParams.get('is_spam');
  const sentiment = searchParams.get('sentiment');
  const commerce_id = searchParams.get('commerce_id');

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('avis')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (is_spam !== null) {
    query = query.eq('is_spam', is_spam === 'true');
  }

  if (sentiment) {
    query = query.eq('sentiment', sentiment);
  }

  if (commerce_id) {
    query = query.eq('commerce_id', commerce_id);
  }

  const { data: avis, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ avis, total: count, page, limit });
}
