import apiClient from './client';
import {
  ChangePasswordRequest,
  SendPhoneOtpRequest,
  VerifyPhoneOtpRequest,
  VerifyEmailOtpRequest,
  Session,
} from '../types/user';

export const userApi = {
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/api/v1/auth/change-password', data);
  },

  sendPhoneOtp: async (data: SendPhoneOtpRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/v1/auth/otp/send', data);
    return response.data;
  },

  verifyPhoneOtp: async (data: VerifyPhoneOtpRequest): Promise<any> => {
    const response = await apiClient.post('/api/v1/auth/otp/verify', data);
    return response.data;
  },

  verifyEmailOtp: async (data: VerifyEmailOtpRequest): Promise<any> => {
    const response = await apiClient.post('/api/v1/auth/email/verify', data);
    return response.data;
  },

  getSessions: async (): Promise<Session[]> => {
    const response = await apiClient.get('/api/v1/sessions');
    return response.data;
  },

  logoutSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/sessions/${sessionId}`);
  },

  logoutAllSessions: async (): Promise<void> => {
    await apiClient.delete('/api/v1/sessions');
  },
};
