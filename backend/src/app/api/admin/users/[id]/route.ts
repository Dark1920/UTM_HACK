// @ts-nocheck
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

const updateSchema = z.object({
  action: z.enum(['activer', 'desactiver', 'changer_role']),
  role: z.enum(['citoyen', 'artisan', 'admin']).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()
  const targetId = params.id

  try {
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { action, role } = parsed.data

    // Protection : un admin ne peut pas se modifier lui-même via cette route
    if (targetId === auth.userId) {
      return NextResponse.json(
        { error: 'Un administrateur ne peut pas modifier son propre compte via cette route' },
        { status: 403 }
      )
    }

    // Vérifier que l'utilisateur cible existe
    const { data: target, error: findError } = await supabase
      .from('utilisateurs')
      .select('id, role')
      .eq('id', targetId)
      .single()

    if (findError || !target) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'activer':
        await supabase.from('utilisateurs').update({ est_actif: true }).eq('id', targetId)
        break

      case 'desactiver':
        await supabase.from('utilisateurs').update({ est_actif: false }).eq('id', targetId)
        break

      case 'changer_role':
        if (!role) {
          return NextResponse.json(
            { error: 'Le champ "role" est requis pour changer le rôle' },
            { status: 400 }
          )
        }
        await supabase.from('utilisateurs').update({ role }).eq('id', targetId)
        break
    }

    return NextResponse.json({ success: true, action, userId: targetId })
  } catch (error) {
    console.error('[/api/admin/users/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()
  const targetId = params.id

  try {
    // Protection : un admin ne peut pas se supprimer lui-même
    if (targetId === auth.userId) {
      return NextResponse.json(
        { error: 'Un administrateur ne peut pas supprimer son propre compte' },
        { status: 403 }
      )
    }

    // Vérifier que l'utilisateur cible existe
    const { data: target, error: findError } = await supabase
      .from('utilisateurs')
      .select('id')
      .eq('id', targetId)
      .single()

    if (findError || !target) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le profil dans la table utilisateurs (cascade via FK)
    await supabase.from('utilisateurs').delete().eq('id', targetId)

    // Supprimer le compte auth associé
    try {
      await supabase.auth.admin.deleteUser(targetId)
    } catch (authErr) {
      console.warn('Utilisateur supprimé du profil mais pas de auth:', authErr)
    }

    return NextResponse.json({ success: true, userId: targetId })
  } catch (error) {
    console.error('[/api/admin/users/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
