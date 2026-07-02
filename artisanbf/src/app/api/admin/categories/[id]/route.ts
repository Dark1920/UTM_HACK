import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const categoryUpdateSchema = z.object({
  nom: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  icone: z.string().min(1).optional(),
  couleur: z.string().optional(),
  description: z.string().optional(),
});

// PUT /api/admin/categories/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const parsed = categoryUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('categories')
    .update(parsed.data)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categorie: data });
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  // Vérifier qu'aucun commerce n'utilise cette catégorie
  const { data: commerces, error: checkError } = await supabase
    .from('commerces')
    .select('id')
    .eq('categorie_id', params.id)
    .limit(1);

  if (checkError) {
    return NextResponse.json({ error: checkError.message }, { status: 500 });
  }

  if (commerces && commerces.length > 0) {
    return NextResponse.json(
      { error: 'Impossible de supprimer une catégorie utilisée par des commerces' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
}
