import axios from 'axios';
import apiClient from '@/utils/apiClient';
import useAuthStore from '@/stores/authStore';
import type { User } from '@/types/user';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  fullName: string;
  newsletter: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

interface AuthResponseData {
  user: User;
  accessToken: string;
}

interface TokenResponseData {
  user: User;
  accessToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponseData>>(
        '/login',
        credentials
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Authentication failed');
      }

      const { user, accessToken } = response.data.data!;
      this.setAuthState(accessToken, user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw this.handleError(error);
    }
  }

  async signup(credentials: SignupCredentials): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponseData>>(
        '/register',
        credentials
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Registration failed');
      }

      console.debug('Registration response headers:', response.headers);
      console.debug('Current cookies:', document.cookie);

      const { user, accessToken } = response.data.data!;
      this.setAuthState(accessToken, user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        await apiClient.post('/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthState();
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<ApiResponse<TokenResponseData>>(
        '/refresh'
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Token refresh failed');
      }

      const { accessToken, user } = response.data.data!;
      this.setAuthState(accessToken, user);
      return accessToken;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      this.clearAuthState();
      throw this.handleError(error);
    }
  }



  private setAuthState(token: string, user: User): void {
    useAuthStore.getState().setAccessToken(token);
    useAuthStore.getState().setUser(user);
  }

  private clearAuthState(): void {
    useAuthStore.getState().setAccessToken(null);
    useAuthStore.getState().setUser(null);
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error) {
        return new Error(error.response.data.error.message);
      }
      return new Error(error.response?.data?.message || 'An error occurred');
    }
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }

  isAuthenticated(): boolean {
    return !!useAuthStore.getState().accessToken;
  }
}

export const authService = new AuthService(); 