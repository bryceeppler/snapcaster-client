import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/authStore'; 

const axiosInstance: AxiosInstance = axios.create({
});

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

// Response interceptor to handle token refresh on 401 response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config || {};
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // mark the request to avoid infinite loop
      try {
        await useAuthStore.getState().refreshAccessToken(); // Attempt to refresh the token
        const newToken = useAuthStore.getState().accessToken;
        if (newToken) {
          originalRequest.headers = originalRequest.headers ?? {}; // Ensure headers is defined
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest); // Retry the original request with the new token
        }
      } catch (refreshError: unknown) {
        if (refreshError instanceof AxiosError) {
          return Promise.reject(refreshError);
        }
        // Handle non-Axios errors here if necessary
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
