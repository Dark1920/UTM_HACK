// GET /api/recherche - Recherche géolocalisée de commerces (publique)
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, rechercheRateLimiter } from '@/lib/ratelimit/upstash';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting par IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success: rateLimitSuccess } = await checkRateLimit(rechercheRateLimiter, ip);

    if (!rateLimitSuccess) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radius = searchParams.get('radius') || '5000';
    const limit = searchParams.get('limit') || '20';

    if (!q && (!lat || !lon)) {
      return NextResponse.json(
        { error: 'Paramètres requis: q (recherche texte) OU lat/lon (géolocalisation)' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    let data;
    let error;

    // Recherche textuelle avec géolocalisation
    if (q) {
      const result = await supabase.rpc('search_commerces', {
        p_search_text: q,
        p_latitude: lat ? parseFloat(lat) : null,
        p_longitude: lon ? parseFloat(lon) : null,
        p_radius_meters: parseInt(radius),
        p_limit: parseInt(limit),
      });
      data = result.data;
      error = result.error;
    } 
    // Recherche par proximité uniquement
    else if (lat && lon) {
      const result = await supabase.rpc('get_commerces_proches', {
        p_latitude: parseFloat(lat),
        p_longitude: parseFloat(lon),
        p_radius_meters: parseInt(radius),
        p_limit: parseInt(limit),
      });
      data = result.data;
      error = result.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('API recherche error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
