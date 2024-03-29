import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/authStore';

const axiosInstance: AxiosInstance = axios.create({});

const clearTokens = () => {
  // clear tokens from local storage
  // set isAuthenticated to false
  useAuthStore.setState({ isAuthenticated: false });
  useAuthStore.setState({ accessToken: null });
  useAuthStore.setState({ refreshToken: null });
};

// Request interceptor to add the auth token header to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
      error.config || {};
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // mark the request to avoid infinite loop
      try {
        const newToken = await useAuthStore.getState().refreshAccessToken(); // Refresh and get the new token directly
        if (newToken !== undefined) {
          // Check if newToken is not undefined
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
    return Promise.reject(error);
  }
);

export default axiosInstance;
