import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commerceId = searchParams.get('commerceId');

  if (!commerceId) {
    return NextResponse.json({ error: 'commerceId requis' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('avis')
    .select('*, utilisateurs(id, nom)')
    .eq('commerce_id', commerceId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const avis = (data || []).map((row: Record<string, unknown>) => {
    const user = row.utilisateurs as Record<string, unknown> | null;
    return {
      id: row.id,
      texte: row.commentaire,
      note: row.note,
      auteurId: row.user_id,
      auteur: user ? { nom: user.nom } : undefined,
      commerceId: row.commerce_id,
      iaScore: row.score_sentiment,
      estSpam: row.is_spam,
      estModer: !row.is_spam,
      sentiment: row.sentiment,
      dateCreation: row.created_at,
    };
  });

  return NextResponse.json(avis);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commerceId, texte, note } = body;

    if (!commerceId || !texte || !note) {
      return NextResponse.json({ error: 'commerceId, texte et note requis' }, { status: 400 });
    }

    // 1. Verify auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. Call AI analyze
    let analyseIA = null;
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const aiRes = await fetch(`${backendUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentaire: texte }),
      });
      if (aiRes.ok) {
        analyseIA = await aiRes.json();
      }
    } catch {
      console.warn('Analyse IA indisponible, avis créé sans analyse');
    }

    // 3. Insert avis
    const { data: avis, error: insertError } = await supabase
      .from('avis')
      .insert({
        user_id: user.id,
        commerce_id: commerceId,
        note,
        commentaire: texte,
        sentiment: analyseIA?.sentiment || 'neutre',
        score_sentiment: analyseIA?.note ? analyseIA.note / 5 : 0,
        is_spam: analyseIA ? !analyseIA.pertinent : false,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 4. Update commerce note moyenne
    const { data: allAvis } = await supabase
      .from('avis')
      .select('note')
      .eq('commerce_id', commerceId);

    if (allAvis && allAvis.length > 0) {
      const avg = allAvis.reduce((sum: number, a: Record<string, unknown>) => sum + (a.note as number), 0) / allAvis.length;
      await supabase
        .from('commerces')
        .update({
          note_moyenne: Math.round(avg * 100) / 100,
          nombre_avis: allAvis.length,
        })
        .eq('id', commerceId);
    }

    return NextResponse.json({
      id: avis.id,
      texte: avis.commentaire,
      note: avis.note,
      auteurId: avis.user_id,
      commerceId: avis.commerce_id,
      iaScore: avis.score_sentiment,
      estSpam: avis.is_spam,
      estModer: !avis.is_spam,
      sentiment: avis.sentiment,
      dateCreation: avis.created_at,
    });
  } catch (error) {
    console.error('[/api/avis]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
