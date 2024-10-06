import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  email: string;
  emailVerified: boolean;
  fullName: string;
  discordUsername: string;
  initializeState: () => void;
  setDiscordUsername: (discordUsername: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  refreshAccessToken: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  hasActiveSubscription: false,
  emailVerified: false,
  email: '',
  discordUsername: '',
  fullName: '',

  initializeState: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true });
      get().fetchUser();
    }
  },
  setDiscordUsername: (discordUsername: string) => {
    set({ discordUsername });
  },
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
    get().fetchUser();
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  refreshAccessToken: async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_USER_URL}/refresh`,
        {
          refreshToken: get().refreshToken
        }
      );
      const { accessToken, refreshToken } = response.data;
      get().setTokens(accessToken, refreshToken);
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
        full_name,
        email,
        email_verified,
        discord_username
      } = response.data;
      set({ hasActiveSubscription: subscription === 'active' });
      set({
        email,
        fullName: full_name,
        emailVerified: email_verified,
        discordUsername: discord_username
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      set({ hasActiveSubscription: false });
    }
  }
}));

export default useAuthStore;
