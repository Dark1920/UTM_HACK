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
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // Use a direct Supabase client (not cookie-based) for API authentication
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await request.json()
    const { email, password, nom, prenom, telephone, role = 'citoyen' } = body

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

    // Auto-confirm the user email using service role key (bypasses email confirmation)
    if (authData.user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Confirm the user's email
      await supabaseAdmin.auth.admin.updateUserById(
        authData.user.id,
        { email_confirm: true }
      )

      // Sign in the user to get a session
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      // Création du profil dans la table utilisateurs
      // Use service role client to bypass RLS policies
      const insertData: Record<string, unknown> = {
        id: authData.user.id,
        nom,
        role
      };
      if (prenom) insertData.prenom = prenom;
      if (telephone) insertData.telephone = telephone;

      const { error: profileError } = await supabaseAdmin
        .from('utilisateurs')
        .insert(insertData)

      if (profileError) {
        console.error('Erreur création profil:', profileError)
      }

      return Response.json({
        message: 'Inscription réussie',
        user: signInData.user || authData.user,
        session: signInData.session,
        profil: {
          id: authData.user.id,
          nom,
          prenom: prenom || null,
          telephone: telephone || null,
          role,
        },
      }, { status: 201 })
    }

    // Fallback: service role key not available
    return Response.json({
      message: 'Inscription réussie',
      user: authData.user,
      session: authData.session,
      profil: authData.user ? {
        id: authData.user.id,
        nom,
        prenom: prenom || null,
        telephone: telephone || null,
        role,
      } : null,
    }, { status: 201 })
  } catch (error) {
    console.error('Inscription error:', error)
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
