import { API_BASE_URL } from '@/constants/api';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Client API pour communiquer avec le backend artisanbf
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Construit l'URL complète avec les paramètres de requête
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Récupère le token d'authentification
   */
  private getAuthHeader(): HeadersInit {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('supabase_token')
      : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Requête GET
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || `Erreur ${response.status}`);
    }

    return response.json();
  }

  /**
   * Requête POST
   */
  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || `Erreur ${response.status}`);
    }

    return response.json();
  }

  /**
   * Requête PUT
   */
  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || `Erreur ${response.status}`);
    }

    return response.json();
  }

  /**
   * Requête DELETE
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
      },
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || `Erreur ${response.status}`);
    }

    return response.json();
  }
}

// Exporter une instance singleton
export const apiClient = new ApiClient(API_BASE_URL);
