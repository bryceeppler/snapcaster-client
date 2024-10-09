import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/authStore';

const axiosInstance: AxiosInstance = axios.create({});

const clearTokens = () => {
  useAuthStore.setState({ isAuthenticated: false });
  useAuthStore.setState({ accessToken: null });
  useAuthStore.setState({ refreshToken: null });
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  useCache?: boolean;
}

// Request interceptor to add the auth token header to every request
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

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
          const newToken = await useAuthStore.getState().refreshAccessToken(); // Refresh and get the new token directly
          if (newToken !== undefined) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest); // Retry the original request with the new token
          }
        } catch (refreshError) {
          // Handle refresh token failure
          clearTokens(); // Clear tokens and log the user out
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
