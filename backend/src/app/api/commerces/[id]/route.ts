// @ts-nocheck
import { createServiceClient, getUser } from '@/lib/supabase/api'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient()
    const { data: commerce, error } = await supabase
      .from('commerces')
      .select('*, categories(*), utilisateurs(id, nom)')
      .eq('id', params.id)
      .single()

    if (error || !commerce) {
      return Response.json({ error: 'Commerce non trouvé' }, { status: 404 })
    }

    return Response.json(commerce)
  } catch (error) {
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const body = await request.json()

    const { data: commerce, error } = await supabase
      .from('commerces')
      .update(body)
      .eq('id', params.id)
      .select('*, categories(*), utilisateurs(id, nom)')
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(commerce)
  } catch (error) {
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('commerces')
      .delete()
      .eq('id', params.id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ message: 'Commerce supprimé' })
  } catch (error) {
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
