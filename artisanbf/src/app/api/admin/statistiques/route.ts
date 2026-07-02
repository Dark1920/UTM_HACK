import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/admin-guard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/statistiques
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const [
      { count: total_utilisateurs },
      { count: total_commerces },
      { count: total_avis },
      { count: signalements_en_cours },
      { count: commerces_en_attente },
    ] = await Promise.all([
      supabase.from('utilisateurs').select('*', { count: 'exact', head: true }),
      supabase.from('commerces').select('*', { count: 'exact', head: true }),
      supabase.from('avis').select('*', { count: 'exact', head: true }),
      supabase.from('signalements').select('*', { count: 'exact', head: true }).eq('statut', 'en_cours'),
      supabase.from('commerces').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
    ]);

    return NextResponse.json({
      total_utilisateurs: total_utilisateurs || 0,
      total_commerces: total_commerces || 0,
      total_avis: total_avis || 0,
      signalements_en_cours: signalements_en_cours || 0,
      commerces_en_attente: commerces_en_attente || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du calcul des statistiques' },
      { status: 500 }
    );
  }
}
