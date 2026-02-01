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
    await apiClient.post('/auth/change-password', data);
  },

  sendPhoneOtp: async (data: SendPhoneOtpRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/otp/send', data);
    return response.data;
  },

  resendPhoneOtp: async (data: SendPhoneOtpRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/otp/resend', data);
    return response.data;
  },

  verifyPhoneOtp: async (data: VerifyPhoneOtpRequest): Promise<any> => {
    const response = await apiClient.post('/auth/phone/verify', data);
    return response.data;
  },

  verifyEmailOtp: async (data: VerifyEmailOtpRequest): Promise<any> => {
    const response = await apiClient.post('/auth/email/verify', data);
    return response.data;
  },

  resendEmailOtp: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/email/resend', { email });
    return response.data;
  },

  getSessions: async (): Promise<Session[]> => {
    const response = await apiClient.get('/sessions');
    return response.data;
  },

  logoutSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/sessions/${sessionId}`);
  },

  logoutAllSessions: async (): Promise<void> => {
    await apiClient.delete('/sessions');
  },
};
