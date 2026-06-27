// @ts-nocheck
/**
 * @swagger
 * /api/auth/inscription:
 *   post:
 *     summary: Créer un nouveau compte
 *     description: Inscrit un nouvel utilisateur avec Supabase Auth
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, nom]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "utilisateur@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "motdepasse123"
 *               nom:
 *                 type: string
 *                 example: "Sawadogo"
 *               prenom:
 *                 type: string
 *                 example: "Ibrahim"
 *               role:
 *                 type: string
 *                 enum: [citoyen, artisan, admin]
 *                 default: citoyen
 *                 example: "citoyen"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Erreur de validation
 */
export async function POST(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()

    const body = await request.json()
    const { email, password, nom, prenom, role = 'citoyen' } = body

    if (!email || !password || !nom) {
      return Response.json(
        { error: 'Les champs email, password et nom sont requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Création de l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom,
          prenom,
          role
        }
      }
    })

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 })
    }

    // Création du profil dans la table utilisateurs
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('utilisateurs')
        .insert({
          id: authData.user.id,
          email,
          nom,
          prenom,
          role
        })

      if (profileError) {
        console.error('Erreur création profil:', profileError)
      }
    }

    return Response.json({
      message: 'Inscription réussie ! Vérifiez votre email.',
      user: authData.user
    }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
