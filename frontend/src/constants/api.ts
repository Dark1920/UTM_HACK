// URL de base du backend (artisanbf)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/connexion',
    REGISTER: '/auth/inscription',
    LOGOUT: '/auth/deconnexion',
    RESET_PASSWORD: '/auth/reinitialisation',
  },
  COMMERCES: {
    LIST: '/commerces',
    DETAIL: (id: string) => `/commerces/${id}`,
    CREATE: '/commerces',
    UPDATE: (id: string) => `/commerces/${id}`,
    DELETE: (id: string) => `/commerces/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
    SEARCH: (q: string) => `/categories?q=${q}`,
  },
  AVIS: {
    LIST: (commerceId: string) => `/avis?commerce_id=${commerceId}`,
    CREATE: '/avis',
    DELETE: (id: string) => `/avis/${id}`,
  },
  RECHERCHE: {
    SEARCH: '/recherche',
    PROXIMITE: '/recherche/proximite',
  },
  GEOCODING: {
    SEARCH: '/geocoding',
    REVERSE: '/geocoding',
  },
  IA: {
    ANALYZE: '/ai/analyze',
    SUMMARIZE: '/ai/summarize',
    SPEECH_TO_TEXT: '/ai/speech-to-text',
    VOICE_SEARCH: '/ai/voice-search',
  },
  ADMIN: {
    UTILISATEURS: {
      LIST: '/admin/utilisateurs',
      DETAIL: (id: string) => `/admin/utilisateurs/${id}`,
    },
    COMMERCES: {
      LIST: '/admin/commerces',
      DETAIL: (id: string) => `/admin/commerces/${id}`,
      STATUT: (id: string) => `/admin/commerces/${id}/statut`,
    },
    AVIS: {
      LIST: '/admin/avis',
      DETAIL: (id: string) => `/admin/avis/${id}`,
    },
    CATEGORIES: {
      LIST: '/admin/categories',
      DETAIL: (id: string) => `/admin/categories/${id}`,
    },
    SIGNALEMENTS: {
      LIST: '/admin/signalements',
      DETAIL: (id: string) => `/admin/signalements/${id}`,
    },
    STATISTIQUES: '/admin/statistiques',
  },
} as const;