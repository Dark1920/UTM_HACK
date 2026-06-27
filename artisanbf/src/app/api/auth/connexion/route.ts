// @ts-nocheck
/**
 * @swagger
 * /api/auth/connexion:
 *   post:
 *     summary: Se connecter
 *     description: Connecte un utilisateur avec email et mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "utilisateur@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "motdepasse123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 session:
 *                   type: object
 */
export async function POST(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json(
        { error: 'Les champs email et password sont requis' },
        { status: 400 }
      )
    }

    // Connexion avec Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return Response.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Récupération du profil utilisateur
    const { data: profil } = await supabase
      .from('utilisateurs')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return Response.json({
      message: 'Connexion réussie',
      user: data.user,
      profil,
      session: data.session
    })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
