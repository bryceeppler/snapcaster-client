import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import { devtools } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  email: string;
  emailVerified: boolean;
  fullName: string;
  discordUsername: string;
  initializeState: () => void;
  setDiscordUsername: (discordUsername: string) => void;
  setTokens: (accessToken: string) => void;
  clearTokens: () => void;
  refreshAccessToken: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>()(devtools((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  hasActiveSubscription: false,
  emailVerified: false,
  email: '',
  discordUsername: '',
  fullName: '',

  initializeState: () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      set({ accessToken, isAuthenticated: true });
      get().fetchUser();
    }
  },
  setDiscordUsername: (discordUsername: string) => {
    set({ discordUsername });
  },
  setTokens: (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    set({ accessToken, isAuthenticated: true });
    get().fetchUser();
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, isAuthenticated: false });
  },
  refreshAccessToken: async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_USER_URL}/refresh`
      );
      const { accessToken } = response.data;
      get().setTokens(accessToken);
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      get().clearTokens();
      throw error;
    }
  },
  fetchUser: async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_USER_URL}/profile`
      );
      const {
        subscription,
        fullName,
        email,
        emailVerified,
        discordUsername
      } = response.data;
      set({ hasActiveSubscription: subscription === 'active' });
      set({
        email,
        fullName,
        emailVerified,
        discordUsername
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      set({ hasActiveSubscription: false });
    }
  }
})));

export default useAuthStore;
