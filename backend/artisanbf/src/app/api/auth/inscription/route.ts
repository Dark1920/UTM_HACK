// @ts-nocheck
import { createServiceClient } from '@/lib/supabase/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, nom, prenom, telephone, role = 'citoyen' } = body

    if (!email || !password || !nom) {
      return Response.json({ error: 'email, password et nom requis' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nom, prenom, telephone, role } },
    })

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      await supabase.from('utilisateurs').insert({
        id: authData.user.id,
        nom,
        prenom: prenom || '',
        telephone: telephone || null,
        role,
      })
    }

    return Response.json({
      user: authData.user ? {
        id: authData.user.id,
        email: authData.user.email,
        nom,
        prenom,
        telephone,
        role,
      } : null,
      token: authData.session?.access_token || '',
    }, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
