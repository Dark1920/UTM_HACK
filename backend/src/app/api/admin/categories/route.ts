// @ts-nocheck
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

const createSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  icone: z.string().optional(),
  description: z.string().optional(),
})

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('nom')

    if (error) {
      console.error('[/api/admin/categories]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mapper snake_case → camelCase
    const mapped = (categories || []).map((c) => ({
      id: c.id,
      nom: c.nom,
      slug: c.slug,
      icone: c.icone || '',
      description: c.description || '',
      nombreCommerces: c.nombre_commerces || 0,
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[/api/admin/categories]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { nom, slug, icone, description } = parsed.data

    // Vérifier que le slug n'existe pas déjà
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce slug existe déjà' },
        { status: 409 }
      )
    }

    const { data: categorie, error } = await supabase
      .from('categories')
      .insert({ nom, slug, icone: icone || '', description: description || '' })
      .select()
      .single()

    if (error) {
      console.error('[/api/admin/categories]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: categorie.id,
      nom: categorie.nom,
      slug: categorie.slug,
      icone: categorie.icone || '',
      description: categorie.description || '',
      nombreCommerces: 0,
    }, { status: 201 })
  } catch (error) {
    console.error('[/api/admin/categories]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
