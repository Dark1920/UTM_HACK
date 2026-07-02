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
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    console.log('=== CONNEXION ATTEMPT ===');
    
    // Parse body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body');
      return Response.json(
        { error: 'Corps de requête invalide' },
        { status: 400 }
      );
    }
    
    const { email, password } = body;
    console.log('Received email:', email);
    console.log('Received password length:', password?.length);

    if (!email || !password) {
      console.error('Missing fields - email:', !!email, 'password:', !!password);
      return Response.json(
        { error: 'Les champs email et password sont requis' },
        { status: 400 }
      );
    }

    // Use a direct Supabase client (not cookie-based) for API authentication
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...');

    // Connexion avec Supabase Auth
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Supabase sign-in result - user:', !!data?.user, 'session:', !!data?.session, 'error:', error?.message);

    // If login fails, try to auto-confirm email and retry
    // This handles cases where email confirmation is required but not done
    if (error && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Initial sign-in failed, attempting auto-confirm:', error.message)
      
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Find the user
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
      const user = usersData?.users?.find((u: any) => u.email === email)

      if (user) {
        // Confirm email if not already confirmed
        if (!user.email_confirmed_at) {
          console.log('Auto-confirming email for user:', email)
          await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true })
        }

        // Retry sign in
        const retry = await supabase.auth.signInWithPassword({ email, password })
        if (!retry.error) {
          data = retry.data
          error = null
          console.log('Retry sign-in successful for:', email)
        } else {
          console.error('Retry sign-in still failed:', retry.error.message)
          error = retry.error
        }
      } else {
        console.log('User not found in Supabase for email:', email)
      }
    }

    if (error) {
      console.error('=== FINAL ERROR ===');
      console.error('Supabase sign-in error:', error.message);
      console.error('Error code:', error.code);
      return Response.json(
        { error: error.message || 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    console.log('=== LOGIN SUCCESS ===');
    console.log('User ID:', data.user?.id);

    // Use service role client to fetch profile (bypasses RLS)
    let profil = null
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      const { data: profilData } = await supabaseAdmin
        .from('utilisateurs')
        .select('*')
        .eq('id', data.user.id)
        .single()
      profil = profilData
    }

    return Response.json({
      message: 'Connexion réussie',
      user: data.user,
      profil,
      session: data.session
    })
  } catch (error) {
    console.error('Connexion error:', error)
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
