import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const statutSchema = z.object({
  statut: z.enum(['publie', 'rejete', 'suspendu', 'en_attente']),
  raison: z.string().optional(),
});

// PUT /api/admin/commerces/[id]/statut
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const parsed = statutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Statut invalide. Valeurs acceptées : publie, rejete, suspendu, en_attente' },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = { statut: parsed.data.statut };
  if (parsed.data.raison) {
    updateData.raison_rejet = parsed.data.raison;
  }

  const { data, error } = await supabase
    .from('commerces')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ commerce: data });
}
