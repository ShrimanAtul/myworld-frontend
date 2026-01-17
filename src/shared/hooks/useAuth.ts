import { create } from 'zustand';
import { AuthState, User } from '@shared/types/auth';
import { setAccessToken as setApiAccessToken } from '@shared/api/client';

interface AuthStore extends AuthState {
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken) => {
    setApiAccessToken(accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },
  clearAuth: () => {
    setApiAccessToken(null);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
