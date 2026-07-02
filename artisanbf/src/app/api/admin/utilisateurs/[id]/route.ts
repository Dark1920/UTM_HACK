import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const roleSchema = z.object({
  role: z.enum(['citoyen', 'artisan', 'admin']),
});

// PUT /api/admin/utilisateurs/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  // Protection : ne peut pas modifier son propre rôle
  if (auth.userId === params.id) {
    return NextResponse.json(
      { error: 'Vous ne pouvez pas modifier votre propre rôle' },
      { status: 400 }
    );
  }

  const body = await request.json();
  const parsed = roleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Rôle invalide. Valeurs acceptées : citoyen, artisan, admin' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('utilisateurs')
    .update({ role: parsed.data.role })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ utilisateur: data });
}

// DELETE /api/admin/utilisateurs/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  // Protection : ne peut pas se désactiver soi-même
  if (auth.userId === params.id) {
    return NextResponse.json(
      { error: 'Vous ne pouvez pas désactiver votre propre compte' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('utilisateurs')
    .update({ est_actif: false })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Utilisateur désactivé avec succès' });
}
