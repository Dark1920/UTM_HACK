export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vwhvuoxyuquyuhijhkay.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3aHZ1b3h5dXF1eXVoaWpoa2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MTIzMTUsImV4cCI6MjA5ODA4ODMxNX0.Z2kh10xqO1Gx-FLUeIz1cBw-TCZOxB-diJxd4vILbrE',
  GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY || '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',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  // Côté serveur uniquement (pas de préfixe NEXT_PUBLIC_) : ne doit jamais être exposée au client.
  PEXELS_API_KEY: process.env.PEXELS_API_KEY || '',
};
