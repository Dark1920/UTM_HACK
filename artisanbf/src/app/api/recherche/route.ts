// @ts-nocheck
/**
 * @swagger
 * /api/recherche:
 *   get:
 *     summary: Rechercher des commerces
 *     description: Recherche des commerces par catégorie, nom ou proximité géographique
 *     tags: [Recherche]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Terme de recherche (nom ou description)
 *         example: "mécanicien"
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *         example: "Mécanicien"
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Latitude de l'utilisateur
 *         example: 12.3714
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Longitude de l'utilisateur
 *         example: -1.5197
 *       - in: query
 *         name: rayon
 *         schema:
 *           type: integer
 *           default: 5000
 *         description: Rayon de recherche en mètres
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
export async function GET(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const categorie = searchParams.get('categorie')
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')
    const rayon = parseInt(searchParams.get('rayon') || '5000')

    let query = supabase
      .from('commerces')
      .select('*')

    // Recherche par texte
    if (q) {
      query = query.or(`nom.ilike.%${q}%,description.ilike.%${q}%`)
    }

    // Filtre par catégorie
    if (categorie) {
      query = query.eq('categorie', categorie)
    }

    // Filtre par proximité (si coordonnées fournies)
    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)

      // Calcul de distance approximatif (formule haverside simplifiée)
      const { data: commerces, error } = await query

      if (error) {
        return Response.json({ error: error.message }, { status: 500 })
      }

      // Filtrer et calculer la distance
      const commercesProches = commerces
        .map(commerce => {
          if (!commerce.latitude || !commerce.longitude) return null

          const distance = calculerDistance(lat, lng, commerce.latitude, commerce.longitude)
          
          return distance <= rayon
            ? { ...commerce, distance }
            : null
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance)

      return Response.json({
        commerces: commercesProches,
        total: commercesProches.length,
        position: { latitude: lat, longitude: lng },
        rayon
      })
    }

    // Sans géolocalisation
    const { data: commerces, error } = await query

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      commerces,
      total: commerces.length
    })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * Calcule la distance entre deux points géographiques (formule de Haversine)
 */
function calculerDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance en mètres
}
