// @ts-nocheck
/**
 * @swagger
 * /api/geocoding:
 *   get:
 *     summary: Géocodage - Convertit une adresse en coordonnées GPS
 *     description: Utilise OpenStreetMap (Nominatim) pour géocoder une adresse au Burkina Faso
 *     tags: [Géolocalisation]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Adresse complète ou lieu
 *         example: "Ouaga 2000, Ouagadougou"
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Ville (sera ajoutée automatiquement si manquante)
 *         example: "Ouagadougou"
 *   post:
 *     summary: Géocodage inverse - Convertit des coordonnées en adresse
 *     description: Trouve l'adresse correspondant à des coordonnées GPS
 *     tags: [Géolocalisation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude]
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 12.3714
 *               longitude:
 *                 type: number
 *                 example: -1.5197
 *     responses:
 *       200:
 *         description: Adresse trouvée
 */

// GET - Géocodage (adresse → coordonnées)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const city = searchParams.get('city') || 'Burkina Faso'

    if (!address) {
      return Response.json(
        { error: 'Le paramètre "address" est requis' },
        { status: 400 }
      )
    }

    // Construction de l'adresse complète
    const fullAddress = address.includes(city) 
      ? address 
      : `${address}, ${city}`

    // Appel à Nominatim (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=5&countrycodes=bf&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ArtisanBF/1.0 (contact@artisanbf.com)'
        }
      }
    )

    const results = await response.json()

    if (!results || results.length === 0) {
      return Response.json({
        found: false,
        message: 'Aucun résultat trouvé. Essayez avec un lieu plus connu ou utilisez la carte pour positionner manuellement.',
        suggestions: [
          'Vérifiez l\'orthographe',
          'Ajoutez le nom de la ville',
          'Utilisez un lieu connu à proximité'
        ]
      })
    }

    // Formatage des résultats
    const formatted = results.map(result => ({
      display_name: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      type: result.type,
      importance: result.importance,
      address: result.address || {}
    }))

    return Response.json({
      found: true,
      count: formatted.length,
      results: formatted,
      primary: formatted[0]
    })
  } catch (error) {
    console.error('Erreur géocodage:', error)
    return Response.json(
      { error: 'Erreur lors du géocodage' },
      { status: 500 }
    )
  }
}

// POST - Géocodage inverse (coordonnées → adresse)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { latitude, longitude } = body

    if (!latitude || !longitude) {
      return Response.json(
        { error: 'Les paramètres latitude et longitude sont requis' },
        { status: 400 }
      )
    }

    // Validation
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return Response.json(
        { error: 'Coordonnées GPS invalides' },
        { status: 400 }
      )
    }

    // Appel à Nominatim pour géocodage inverse
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`,
      {
        headers: {
          'User-Agent': 'ArtisanBF/1.0 (contact@artisanbf.com)'
        }
      }
    )

    const result = await response.json()

    if (!result || result.error) {
      return Response.json({
        found: false,
        message: 'Aucune adresse trouvée à ces coordonnées',
        coordinates: { latitude, longitude }
      })
    }

    return Response.json({
      found: true,
      display_name: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.address || {},
      type: result.type,
      osm_type: result.osm_type
    })
  } catch (error) {
    console.error('Erreur géocodage inverse:', error)
    return Response.json(
      { error: 'Erreur lors du géocodage inverse' },
      { status: 500 }
    )
  }
}
