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

export const useVerifyPhoneOtp = () => {
  const { setAuth, user } = useAuthStore();
  
  return useMutation({
    mutationFn: userApi.verifyPhoneOtp,
    onSuccess: (data) => {
      if (user) {
        setAuth({ ...user, phoneVerified: true }, data.accessToken);
      }
    },
  });
};

export const useVerifyEmailOtp = () => {
  const { setAuth, user } = useAuthStore();
  
  return useMutation({
    mutationFn: userApi.verifyEmailOtp,
    onSuccess: (data) => {
      if (user) {
        setAuth({ ...user, emailVerified: true }, data.accessToken);
      }
    },
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
