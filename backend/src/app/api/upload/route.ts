// @ts-nocheck
import { createServiceClient, getUser } from '@/lib/supabase/api'

const BUCKET = 'commerces'
const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo

// POST /api/upload  (multipart, champ "file")
// Envoie une image vers Supabase Storage et renvoie son URL publique.
export async function POST(request: Request) {
  try {
    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Le fichier doit être une image' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'Image trop volumineuse (max 5 Mo)' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return Response.json(
      { url: data.publicUrl, filename: file.name, size: file.size, type: file.type },
      { status: 201 }
    )
  } catch (error) {
    console.error('[/api/upload]', error)
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
