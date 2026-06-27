// @ts-nocheck
/**
 * @swagger
 * /api/commerces/{id}:
 *   get:
 *     summary: Obtenir un commerce par ID
 *     description: Retourne les détails d'un commerce spécifique
 *     tags: [Commerces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commerce
 *     responses:
 *       200:
 *         description: Commerce trouvé
 *       404:
 *         description: Commerce non trouvé
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const { data: commerce, error } = await supabase
      .from('commerces')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !commerce) {
      return Response.json(
        { error: 'Commerce non trouvé' },
        { status: 404 }
      )
    }

    return Response.json(commerce)
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/commerces/{id}:
 *   put:
 *     summary: Modifier un commerce
 *     description: Met à jour les informations d'un commerce
 *     tags: [Commerces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               categorie:
 *                 type: string
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Commerce mis à jour
 *       404:
 *         description: Commerce non trouvé
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const body = await request.json()

    const { data: commerce, error } = await supabase
      .from('commerces')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!commerce) {
      return Response.json(
        { error: 'Commerce non trouvé' },
        { status: 404 }
      )
    }

    return Response.json(commerce)
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/commerces/{id}:
 *   delete:
 *     summary: Supprimer un commerce
 *     description: Supprime un commerce de la base de données
 *     tags: [Commerces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commerce supprimé
 *       404:
 *         description: Commerce non trouvé
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const { error } = await supabase
      .from('commerces')
      .delete()
      .eq('id', params.id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ message: 'Commerce supprimé avec succès' })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
