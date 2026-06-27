// @ts-nocheck
/**
 * @swagger
 * /api/commerces:
 *   get:
 *     summary: Liste tous les commerces
 *     description: Retourne la liste de tous les commerces avec pagination
 *     tags: [Commerces]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre de résultats par page
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *     responses:
 *       200:
 *         description: Liste des commerces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commerces:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
export async function GET(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const categorie = searchParams.get('categorie')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('commerces')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (categorie) {
      query = query.eq('categorie', categorie)
    }

    const { data: commerces, error, count } = await query

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      commerces,
      total: count,
      page,
      limit
    })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/commerces:
 *   post:
 *     summary: Créer un nouveau commerce
 *     description: Crée un nouveau commerce dans la base de données
 *     tags: [Commerces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, categorie, adresse]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Garage du Faso"
 *               categorie:
 *                 type: string
 *                 example: "Mécanicien"
 *               adresse:
 *                 type: string
 *                 example: "Ouaga 2000, rue 12.34"
 *               telephone:
 *                 type: string
 *                 example: "+226 70 12 34 56"
 *               description:
 *                 type: string
 *                 example: "Spécialiste en réparation de motos et voitures"
 *               latitude:
 *                 type: number
 *                 example: 12.3714
 *               longitude:
 *                 type: number
 *                 example: -1.5197
 *     responses:
 *       201:
 *         description: Commerce créé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(
        { error: 'Vous devez être connecté pour créer un commerce' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { nom, categorie, localisation, ville, telephone, description } = body

    // Validation des champs obligatoires
    if (!nom || !categorie || !localisation || !ville) {
      return Response.json(
        { error: 'Les champs nom, categorie, localisation et ville sont requis' },
        { status: 400 }
      )
    }

    // 1. Récupérer l'ID de la catégorie automatiquement
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .ilike('nom', `%${categorie}%`)  // Recherche insensible à la casse
      .limit(1)
      .single()

    if (categoryError || !categoryData) {
      return Response.json(
        { error: `La catégorie "${categorie}" n'existe pas. Catégories disponibles : Restauration, Jardinage, Téléphonie, Plomberie, Électricité, Maçonnerie` },
        { status: 400 }
      )
    }

    const categorie_id = categoryData.id

    // 2. Géocodage automatique avec gestion d'erreurs améliorée
    let latitude = body.latitude || null
    let longitude = body.longitude || null
    let geocodingSuccess = false
    
    // Si les coordonnées ne sont pas fournies, on géocode
    if (!latitude || !longitude) {
      try {
        const adresseComplete = `${localisation}, ${ville}, Burkina Faso`
        
        // Tentative 1 : Nominatim (OpenStreetMap)
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresseComplete)}&limit=1&countrycodes=bf`,
          {
            headers: {
              'User-Agent': 'ArtisanBF/1.0 (contact@artisanbf.com)'
            }
          }
        )
        const geoData = await geoResponse.json()
        
        if (geoData && geoData.length > 0) {
          latitude = parseFloat(geoData[0].lat)
          longitude = parseFloat(geoData[0].lon)
          geocodingSuccess = true
        } else {
          // Tentative 2 : Recherche plus large (juste la ville)
          const fallbackResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ville + ', Burkina Faso')}&limit=1`,
            {
              headers: {
                'User-Agent': 'ArtisanBF/1.0 (contact@artisanbf.com)'
              }
            }
          )
          const fallbackData = await fallbackResponse.json()
          
          if (fallbackData && fallbackData.length > 0) {
            latitude = parseFloat(fallbackData[0].lat)
            longitude = parseFloat(fallbackData[0].lon)
            geocodingSuccess = true
          }
        }
      } catch (error) {
        console.error('Erreur géocodage:', error)
        // Continuer même si le géocodage échoue
      }
    } else {
      geocodingSuccess = true // Coordonnées fournies manuellement
    }
    
    // Validation des coordonnées
    if (latitude && longitude) {
      if (latitude < -90 || latitude > 90) {
        return Response.json(
          { error: 'Latitude invalide (doit être entre -90 et 90)' },
          { status: 400 }
        )
      }
      if (longitude < -180 || longitude > 180) {
        return Response.json(
          { error: 'Longitude invalide (doit être entre -180 et 180)' },
          { status: 400 }
        )
      }
      
      // Vérification que les coordonnées sont bien au Burkina Faso
      if (latitude < 9 || latitude > 15 || longitude < -6 || longitude > 2) {
        return Response.json(
          { error: 'Les coordonnées doivent être situées au Burkina Faso' },
          { status: 400 }
        )
      }
    }

    // 3. Création du commerce
    const insertData: any = { 
      nom, 
      localisation,
      ville,
      categorie_id,
      user_id: user.id,
      statut: 'en_attente'
    }
    
    if (telephone) insertData.telephone = telephone
    if (description) insertData.description = description
    if (latitude !== null) insertData.latitude = latitude
    if (longitude !== null) insertData.longitude = longitude

    const { data: commerce, error } = await supabase
      .from('commerces')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      ...commerce,
      message: 'Commerce créé avec succès ! Les coordonnées GPS ont été automatiquement calculées.',
      geocodage: latitude && longitude ? 'réussi' : 'échoué (adresse peut-être imprécise)'
    }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
