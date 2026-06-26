import { createClient } from '@supabase/supabase-js';

export function getSession() {
  // Mock pour le prototype
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('mock-session');
  return stored ? JSON.parse(stored) : null;
}

export function setSession(session: { user: { id: string; email: string; role: string } } | null) {
  if (typeof window === 'undefined') return;
  if (session) {
    localStorage.setItem('mock-session', JSON.stringify(session));
  } else {
    localStorage.removeItem('mock-session');
  }
}
