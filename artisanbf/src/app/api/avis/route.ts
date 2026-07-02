// @ts-nocheck
/**
 * @swagger
 * /api/avis:
 *   get:
 *     summary: Liste les avis d'un commerce
 *     description: Retourne tous les avis pour un commerce spécifique avec pagination
 *     tags: [Avis]
 *     parameters:
 *       - in: query
 *         name: commerce_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commerce
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des avis
 */
export async function GET(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const { searchParams } = new URL(request.url)
    const commerce_id = searchParams.get('commerce_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!commerce_id) {
      return Response.json(
        { error: 'Le paramètre commerce_id est requis' },
        { status: 400 }
      )
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: avis, error, count } = await supabase
      .from('avis')
      .select('*', { count: 'exact' })
      .eq('commerce_id', commerce_id)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      avis,
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
 * /api/avis:
 *   post:
 *     summary: Créer un avis avec analyse IA automatique
 *     description: Crée un nouvel avis et l'analyse automatiquement avec l'IA
 *     tags: [Avis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [commerce_id, note, commentaire]
 *             properties:
 *               commerce_id:
 *                 type: string
 *                 example: "uuid-du-commerce"
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               commentaire:
 *                 type: string
 *                 example: "Très bon service, je recommande ce mécanicien"
 *     responses:
 *       201:
 *         description: Avis créé avec analyse IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avis:
 *                   type: object
 *                 analyse_ia:
 *                   type: object
 */
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification via le header Bearer
    const { requireAuth } = await import('@/lib/supabase/auth-guard')
    const auth = await requireAuth(request)
    if (auth instanceof Response) return auth // 401

    const { userId } = auth

    // Utiliser le service role key pour bypasser RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const supabase = createServiceClient(supabaseUrl!, supabaseKey!)

    const body = await request.json()
    const { commerce_id, note, commentaire } = body

    if (!commerce_id || !note || !commentaire) {
      return Response.json(
        { error: 'Les champs commerce_id, note et commentaire sont requis' },
        { status: 400 }
      )
    }

    if (note < 1 || note > 5) {
      return Response.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      )
    }

    // Analyse IA du commentaire
    let analyseIA = null
    try {
      const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1'
      const analyzeResponse = await fetch(`${AI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en analyse de sentiments. Analyse ce commentaire et retourne UNIQUEMENT un JSON avec:
              - pertinent: boolean (est-ce un avis légitime ou spam?)
              - note: number (1-5, la note implicite dans le commentaire)
              - sentiment: string (positif/neutre/negatif)
              - criteres: { qualite: number, professionnalisme: number, rapidite: number, prix: number }
              - points_forts: string[]
              - points_faibles: string[]
              - justification: string`
            },
            {
              role: 'user',
              content: commentaire
            }
          ],
          response_format: { type: 'json_object' }
        })
      })

      const aiData = await analyzeResponse.json()
      analyseIA = JSON.parse(aiData.choices[0].message.content)
    } catch (error) {
      console.error('Erreur analyse IA:', error)
    }

    // Création de l'avis avec service role key
    const { data: avis, error } = await supabase
      .from('avis')
      .insert({
        commerce_id,
        user_id: userId,
        note,
        commentaire,
        sentiment: analyseIA?.sentiment || 'neutre',
        score_sentiment: analyseIA?.note || 0,
        is_spam: analyseIA?.pertinent === false,
        analyse_ia: analyseIA
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      avis,
      analyse_ia: analyseIA
    }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
