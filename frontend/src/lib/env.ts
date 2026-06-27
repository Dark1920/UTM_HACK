export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  // Côté serveur uniquement (pas de préfixe NEXT_PUBLIC_) : ne doit jamais être exposée au client.
  PEXELS_API_KEY: process.env.PEXELS_API_KEY || '',
};
