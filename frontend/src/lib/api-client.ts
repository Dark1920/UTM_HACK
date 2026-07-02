/**
 * Client HTTP partagé pour tous les services frontend.
 * Centralise : injection du token d'auth, sérialisation JSON / FormData,
 * construction du query string et gestion homogène des erreurs.
 */

const TOKEN_KEY = 'supabase_token';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

type QueryValue = string | number | boolean | null | undefined;

function buildQuery(query?: Record<string, QueryValue>): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Corps de requête : objet (JSON) ou FormData (multipart). */
  body?: unknown;
  /** Attache le token Bearer si présent. */
  auth?: boolean;
  /** Paramètres d'URL (les valeurs vides/null/undefined sont ignorées). */
  query?: Record<string, QueryValue>;
}

/**
 * Effectue une requête et renvoie le JSON typé.
 * Lève une ApiError (avec le message d'erreur serveur) sur réponse non-2xx.
 */
export async function apiFetch<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, query } = opts;

  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;

  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${path}${buildQuery(query)}`, { method, headers, body: payload });

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* réponse non-JSON : on garde le message par défaut */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
