import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import { authService } from '@/services/authService';

// Token manager to be used by both axios interceptors and useAuth hook
export const tokenManager = {
  accessToken: null as string | null,
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }
};

const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true // Enable sending cookies with all requests
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  useCache?: boolean;
}

// Request interceptor to add the auth token header to every request
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = tokenManager.accessToken;

    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (typeof config.useCache !== 'undefined') {
      config.headers = config.headers || {};
      config.headers['X-Use-Cache'] = config.useCache ? 'true' : 'false';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and retry the request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && error.config) {
      const originalRequest = error.config as CustomAxiosRequestConfig & { _retry?: boolean };

      if (!originalRequest._retry) {
        originalRequest._retry = true; // Mark the request to avoid an infinite loop

        try {
          // Use the authService to refresh the token
          const newToken = await authService.refreshToken();
          // Update the token in the manager
          tokenManager.setAccessToken(newToken);
          // Update the Authorization header
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure
          tokenManager.setAccessToken(null);
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
