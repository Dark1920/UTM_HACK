export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  COMMERCES: {
    LIST: '/api/commerces',
    DETAIL: (id: string) => `/api/commerces/${id}`,
    CREATE: '/api/commerces',
    UPDATE: (id: string) => `/api/commerces/${id}`,
    DELETE: (id: string) => `/api/commerces/${id}`,
  },
  COMMENTAIRES: {
    LIST: (commerceId: string) => `/api/commentaires?commerceId=${commerceId}`,
    CREATE: '/api/commentaires',
    DELETE: (id: string) => `/api/commentaires/${id}`,
  },
  FAVORIS: {
    LIST: '/api/favoris',
    TOGGLE: '/api/favoris',
  },
  UPLOAD: '/api/upload',
  GEOLOCATION: '/api/geolocation',
  IA: {
    ANALYSE: '/api/ia/analyse',
    RESUME: '/api/ia/resume',
    SPAM: '/api/ia/spam',
  },
  STATISTIQUES: {
    COMMERCE: (id: string) => `/api/statistiques/commerce/${id}`,
    GLOBALES: '/api/statistiques/globales',
  },
  SIGNALEMENTS: {
    LIST: '/api/signalements',
    CREATE: '/api/signalements',
  },
  WHATSAPP: '/api/whatsapp',
  ADMIN: {
    USERS: '/api/admin/utilisateurs',
    COMMERCES: '/api/admin/commerces',
    COMMENTAIRES: '/api/admin/commentaires',
    CATEGORIES: '/api/admin/categories',
  },
} as const;