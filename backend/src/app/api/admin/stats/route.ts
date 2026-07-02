// @ts-nocheck
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    // Requêtes parallèles pour les compteurs
    const [
      { count: totalUtilisateurs },
      { count: totalCommerces },
      { count: totalAvis },
      { count: signalementsEnAttente },
      { count: avisSpam },
      { data: totalVuesData },
      { data: categoriesData },
    ] = await Promise.all([
      supabase.from('utilisateurs').select('*', { count: 'exact', head: true }),
      supabase.from('commerces').select('*', { count: 'exact', head: true }),
      supabase.from('avis').select('*', { count: 'exact', head: true }),
      supabase.from('signalements').select('*', { count: 'exact', head: true }).eq('statut', 'pending'),
      supabase.from('avis').select('*', { count: 'exact', head: true }).eq('is_spam', true),
      supabase.from('commerces').select('nombre_vues'),
      supabase.from('categories').select('nom, nombre_commerces').order('nombre_commerces', { ascending: false }),
    ])

    // Calcul total vues
    const totalVues = (totalVuesData || []).reduce((sum, c) => sum + (c.nombre_vues || 0), 0)

    // Activité récente : 4 requêtes parallèles
    const [
      { data: recentUsers },
      { data: recentCommerces },
      { data: recentAvis },
      { data: recentSignalements },
    ] = await Promise.all([
      supabase.from('utilisateurs')
        .select('id, nom, prenom, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('commerces')
        .select('id, nom, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('avis')
        .select('id, commentaire, commerce_id, created_at, utilisateurs(nom)')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('signalements')
        .select('id, raison, commerce_id, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    // Fusionner et formater l'activité récente
    const activiteRecente = [
      ...(recentUsers || []).map((u) => ({
        type: 'inscription',
        description: `Nouvel utilisateur inscrit : ${u.prenom} ${u.nom}`,
        date: u.created_at,
        id: u.id,
      })),
      ...(recentCommerces || []).map((c) => ({
        type: 'nouveau_commerce',
        description: `Nouveau commerce : ${c.nom}`,
        date: c.created_at,
        id: c.id,
      })),
      ...(recentAvis || []).map((a) => ({
        type: 'nouvel_avis',
        description: `Nouvel avis sur le commerce ${a.utilisateurs?.nom || 'inconnu'}`,
        date: a.created_at,
        id: a.id,
      })),
      ...(recentSignalements || []).map((s) => ({
        type: 'signalement',
        description: `Signalement : ${s.raison}`,
        date: s.created_at,
        id: s.id,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    // Répartition par catégorie
    const totalCommercesParCategorie = (categoriesData || []).reduce(
      (sum, c) => sum + (c.nombre_commerces || 0), 0
    )
    const repartitionCategories = (categoriesData || []).map((c) => ({
      nom: c.nom,
      nombre_commerces: c.nombre_commerces || 0,
      pourcentage: totalCommercesParCategorie > 0
        ? Math.round(((c.nombre_commerces || 0) / totalCommercesParCategorie) * 100)
        : 0,
    }))

    return NextResponse.json({
      total_utilisateurs: totalUtilisateurs || 0,
      total_commerces: totalCommerces || 0,
      total_avis: totalAvis || 0,
      total_vues: totalVues,
      signalements_en_attente: signalementsEnAttente || 0,
      avis_spam: avisSpam || 0,
      activite_recente: activiteRecente,
      repartition_categories: repartitionCategories,
    })
  } catch (error) {
    console.error('[/api/admin/stats]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
