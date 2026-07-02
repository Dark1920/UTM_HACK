import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';

export const authService = {
  async login(email: string, password: string) {
    return apiClient.post<any>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email, password }
    );
  },

  async register(data: { email: string; password: string; nom: string; prenom: string; role?: string }) {
    return apiClient.post<any>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
  },

  async logout() {
    return apiClient.post<any>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
  },

  async resetPassword(email: string) {
    return apiClient.post<any>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { email }
    );
  },
};
