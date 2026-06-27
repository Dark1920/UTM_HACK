// Server Actions pour le dashboard (statistiques)
// @ts-nocheck - Types Supabase seront générés après configuration
'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Incrémenter le compteur de vues d'un commerce
 */
export async function trackVueCommerce(commerceId: string) {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  // Utiliser UPSERT pour incrémenter ou créer
  // @ts-ignore
  await supabase.rpc('increment_statistique', {
    p_commerce_id: commerceId,
    p_date: today,
    p_type: 'vues',
  });
}

/**
 * Incrémenter le compteur d'appels
 */
export async function trackAppelCommerce(commerceId: string) {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  // @ts-ignore
  await supabase.rpc('increment_statistique', {
    p_commerce_id: commerceId,
    p_date: today,
    p_type: 'appels',
  });
}

/**
 * Incrémenter le compteur de clics WhatsApp
 */
export async function trackWhatsAppClick(commerceId: string) {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  // @ts-ignore
  await supabase.rpc('increment_statistique', {
    p_commerce_id: commerceId,
    p_date: today,
    p_type: 'clics_whatsapp',
  });
}

/**
 * Récupérer les statistiques d'un commerce
 */
export async function getCommerceStats(commerceId: string, days: number = 30) {
  const supabase = createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('statistiques_commerces')
    .select('*')
    .eq('commerce_id', commerceId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) return [];
  return data;
}
