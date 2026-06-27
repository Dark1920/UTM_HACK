// @ts-nocheck
import { createServiceClient } from '@/lib/supabase/api'

export async function GET(request: Request) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const categorie = searchParams.get('categorie')
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')
    const rayon = parseInt(searchParams.get('rayon') || '5000')

    let query = supabase
      .from('commerces')
      .select('*, categories(*), utilisateurs(id, nom)')
      .eq('est_public', true)

    if (q) {
      query = query.or(`nom.ilike.%${q}%,description.ilike.%${q}%`)
    }
    if (categorie) {
      query = query.eq('categorie_id', categorie)
    }

    const { data: commerces, error } = await query

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)

      const commercesProches = commerces
        .map((commerce) => {
          if (!commerce.latitude || !commerce.longitude) return null
          const distance = calculerDistance(lat, lng, commerce.latitude, commerce.longitude)
          return distance <= rayon ? { ...commerce, distance } : null
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance)

      return Response.json({ commerces: commercesProches, total: commercesProches.length })
    }

    return Response.json({ commerces, total: commerces.length })
  } catch (error) {
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

function calculerDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
