// @ts-nocheck
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Liste toutes les catégories disponibles
 *     description: Retourne la liste des catégories d'artisans/commerces avec suggestions
 *     tags: [Commerces]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Terme de recherche pour filtrer les catégories
 *         example: "meca"
 *     responses:
 *       200:
 *         description: Liste des catégories
 */
export async function GET(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    let query = supabase
      .from('categories')
      .select('id, nom, slug, description, icone, couleur')
      .order('nom')

    // Recherche par terme
    if (q) {
      query = query.ilike('nom', `%${q}%`)
    }

    const { data: categories, error } = await query

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      categories,
      total: categories.length,
      message: q ? `Catégories correspondant à "${q}"` : 'Toutes les catégories'
    })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
