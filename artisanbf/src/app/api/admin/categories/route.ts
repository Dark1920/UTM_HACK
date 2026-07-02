import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const categorySchema = z.object({
  nom: z.string().min(1),
  slug: z.string().min(1),
  icone: z.string().min(1),
  couleur: z.string().optional(),
  description: z.string().optional(),
});

// GET /api/admin/categories
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('nom');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories });
}

// POST /api/admin/categories
export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('categories')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categorie: data }, { status: 201 });
}
