import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const signalementSchema = z.object({
  statut: z.enum(['traite', 'ignore']),
  note_moderateur: z.string().optional(),
});

// PUT /api/admin/signalements/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const parsed = signalementSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides. Statut accepté : traite, ignore' },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {
    statut: parsed.data.statut,
    traite_par: auth.userId,
    traite_at: new Date().toISOString(),
  };

  if (parsed.data.note_moderateur) {
    updateData.note_moderateur = parsed.data.note_moderateur;
  }

  const { data, error } = await supabase
    .from('signalements')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signalement: data });
}
