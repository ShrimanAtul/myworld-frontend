import apiClient from './client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@shared/types/auth';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
