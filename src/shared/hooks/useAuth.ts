import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@shared/types/auth';
import { setAccessToken as setApiAccessToken } from '@shared/api/client';

interface AuthStore extends AuthState {
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        console.log('[AuthStore] setAuth called with:', { user, accessToken: accessToken?.substring(0, 20) + '...' });
        setApiAccessToken(accessToken);
        set({ user, accessToken, isAuthenticated: true });
        console.log('[AuthStore] State updated successfully');
      },
      clearAuth: () => {
        setApiAccessToken(null);
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Restore the access token to the API client when rehydrating from storage
        if (state?.accessToken) {
          setApiAccessToken(state.accessToken);
        }
      },
    }
  )
);
