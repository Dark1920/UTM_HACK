import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export function createServerClient() {
  // For server-side, use the same anon key (or add SERVICE_ROLE_KEY to env.ts if needed)
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
