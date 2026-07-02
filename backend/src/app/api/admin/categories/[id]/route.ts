// @ts-nocheck
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

const updateSchema = z.object({
  nom: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  icone: z.string().optional(),
  description: z.string().optional(),
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

    // Vérifier que la catégorie existe
    const { data: existing, error: findError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', (await params).id)
      .single()

    if (findError || !existing) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    const updateData = {}
    if (parsed.data.nom !== undefined) updateData.nom = parsed.data.nom
    if (parsed.data.slug !== undefined) updateData.slug = parsed.data.slug
    if (parsed.data.icone !== undefined) updateData.icone = parsed.data.icone
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description

    const { data: categorie, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', (await params).id)
      .select()
      .single()

    if (error) {
      console.error('[/api/admin/categories/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: categorie.id,
      nom: categorie.nom,
      slug: categorie.slug,
      icone: categorie.icone || '',
      description: categorie.description || '',
      nombreCommerces: categorie.nombre_commerces || 0,
    })
  } catch (error) {
    console.error('[/api/admin/categories/[id]]', error)
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
    // Vérifier que la catégorie existe
    const { data: existing, error: findError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', (await params).id)
      .single()

    if (findError || !existing) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', (await params).id)

    if (error) {
      console.error('[/api/admin/categories/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, categoryId: (await params).id })
  } catch (error) {
    console.error('[/api/admin/categories/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
