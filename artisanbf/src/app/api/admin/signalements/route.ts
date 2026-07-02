import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/signalements
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const statut = searchParams.get('statut');
  const type_cible = searchParams.get('type_cible');

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('signalements')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (statut) {
    query = query.eq('statut', statut);
  }

  if (type_cible) {
    query = query.eq('type_cible', type_cible);
  }

  const { data: signalements, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signalements, total: count, page, limit });
}
