import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { useAuthStore } from './useAuth';

export const userKeys = {
  sessions: ['sessions'] as const,
};

export const useSessions = () => {
  return useQuery({
    queryKey: userKeys.sessions,
    queryFn: userApi.getSessions,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userApi.changePassword,
  });
};

export const useSendPhoneOtp = () => {
  return useMutation({
    mutationFn: userApi.sendPhoneOtp,
  });
};

export const useResendPhoneOtp = () => {
  return useMutation({
    mutationFn: userApi.resendPhoneOtp,
  });
};

export const useVerifyPhoneOtp = () => {
  const { setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: userApi.verifyPhoneOtp,
    onSuccess: (data) => {
      console.log('[useVerifyPhoneOtp] Phone verification successful, response:', data);
      
      if (data.accessToken) {
        console.log('[useVerifyPhoneOtp] Updating auth store with phoneVerified =', data.phoneVerified);
        setAuth({
          id: data.userId,
          email: data.email,
          role: data.role,
          emailVerified: data.emailVerified,
          phoneVerified: data.phoneVerified,
        }, data.accessToken);
        console.log('[useVerifyPhoneOtp] Auth store updated successfully');
      } else {
        console.error('[useVerifyPhoneOtp] No accessToken in response, cannot update auth store');
      }
    },
  });
};

export const useVerifyEmailOtp = () => {
  const { setAuth, user, accessToken } = useAuthStore();
  
  return useMutation({
    mutationFn: userApi.verifyEmailOtp,
    onSuccess: (data) => {
      console.log('[useVerifyEmailOtp] Email verification successful, response:', data);
      
      // Email verification endpoint returns UserResponse (not TokenResponse)
      // So we need to manually update the user object and keep the existing token
      if (user && accessToken) {
        console.log('[useVerifyEmailOtp] Updating auth store with emailVerified = true');
        setAuth({ ...user, emailVerified: true }, accessToken);
        console.log('[useVerifyEmailOtp] Auth store updated successfully');
      } else {
        console.error('[useVerifyEmailOtp] Missing user or accessToken, cannot update auth store');
      }
    },
  });
};

export const useResendEmailOtp = () => {
  return useMutation({
    mutationFn: userApi.resendEmailOtp,
  });
};

export const useLogoutSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.logoutSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.sessions });
    },
  });
};

export const useLogoutAllSessions = () => {
  const { clearAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: userApi.logoutAllSessions,
    onSuccess: () => {
      clearAuth();
    },
  });
};
