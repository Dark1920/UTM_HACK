// @ts-nocheck
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

const updateSchema = z.object({
  action: z.enum(['resolve', 'dismiss']),
  note_moderateur: z.string().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { action, note_moderateur } = parsed.data

    // Vérifier que le signalement existe
    const { data: existing, error: findError } = await supabase
      .from('signalements')
      .select('id, statut')
      .eq('id', (await params).id)
      .single()

    if (findError || !existing) {
      return NextResponse.json({ error: 'Signalement non trouvé' }, { status: 404 })
    }

    const newStatut = action === 'resolve' ? 'resolved' : 'dismissed'

    const { error } = await supabase
      .from('signalements')
      .update({
        statut: newStatut,
        resolu_par: auth.userId,
        resolu_le: new Date().toISOString(),
        note_moderateur: note_moderateur || null,
      })
      .eq('id', (await params).id)

    if (error) {
      console.error('[/api/admin/signalements/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      signalementId: (await params).id,
      statut: newStatut,
    })
  } catch (error) {
    console.error('[/api/admin/signalements/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    // Vérifier que le signalement existe
    const { data: existing, error: findError } = await supabase
      .from('signalements')
      .select('id')
      .eq('id', (await params).id)
      .single()

    if (findError || !existing) {
      return NextResponse.json({ error: 'Signalement non trouvé' }, { status: 404 })
    }

    const { error } = await supabase
      .from('signalements')
      .delete()
      .eq('id', (await params).id)

    if (error) {
      console.error('[/api/admin/signalements/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, signalementId: (await params).id })
  } catch (error) {
    console.error('[/api/admin/signalements/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
