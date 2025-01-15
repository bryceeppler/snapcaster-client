import { create } from 'zustand';
import axios from 'axios';
import apiClient from '@/utils/apiClient';
import { devtools } from 'zustand/middleware';
import type { User } from '@/types/user';
import { authService } from '@/services/authService';

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isRefreshing: boolean;
  refreshPromise: Promise<string | null> | null;
  initializeState: () => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(devtools((set, get) => ({
  accessToken: null,
  user: null,
  isRefreshing: false,
  refreshPromise: null,
  initializeState: async () => {
    try {
      // Only attempt to refresh if we don't have a user
      if (!get().user) {
        // If already refreshing, wait for that promise
        if (get().isRefreshing && get().refreshPromise) {
          await get().refreshPromise;
          return;
        }

        // Start a new refresh
        set({ isRefreshing: true });
        const refreshPromise = authService.refreshToken();
        set({ refreshPromise });

        try {
          await refreshPromise;
        } finally {
          set({ isRefreshing: false, refreshPromise: null });
        }
      }
    } catch (error) {
      // Clear the state if there's an error
      set({ accessToken: null, user: null });
      console.error('Failed to initialize auth state:', error);
    }
  },
  setAccessToken: (token: string | null) => {
    set({ accessToken: token });
  },
  setUser: (user: User | null) => {
    set({ user: user });
  },
  logout: () => {
    set({ accessToken: null, user: null });
    apiClient.post(`${process.env.NEXT_PUBLIC_USER_URL}/logout`);
  }
})));

export default useAuthStore;
