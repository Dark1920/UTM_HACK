import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DELETE /api/admin/avis/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { error } = await supabase
    .from('avis')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Avis supprimé avec succès' });
}
