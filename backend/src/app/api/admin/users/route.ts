// @ts-nocheck
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const role = searchParams.get('role')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('utilisateurs')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (role && role !== 'all') {
      query = query.eq('role', role)
    }

    if (search) {
      const s = `%${search}%`
      query = query.or(`nom.ilike.${s},prenom.ilike.${s}`)
    }

    const { data: users, error, count } = await query

    if (error) {
      console.error('[/api/admin/users]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Récupérer les emails depuis auth.users en parallèle
    const usersWithEmails = await Promise.all(
      (users || []).map(async (u) => {
        let email = ''
        try {
          const { data: authData } = await supabase.auth.admin.getUserById(u.id)
          email = authData?.user?.email || ''
        } catch {}
        return {
          id: u.id,
          email,
          nom: u.nom,
          prenom: u.prenom,
          telephone: u.telephone,
          role: u.role,
          estActif: u.est_actif ?? true,
          dateCreation: u.created_at,
        }
      })
    )

    return NextResponse.json({
      users: usersWithEmails,
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('[/api/admin/users]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
