import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/authStore';

export type ServiceType = 'user' | 'search' | 'inventory';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  useCache?: boolean;
  skipAuthRefresh?: boolean;
  service?: ServiceType;
}

const getBaseUrl = (service: ServiceType = 'user'): string => {
  switch (service) {
    case 'user':
      return process.env.NEXT_PUBLIC_USER_URL || '';
    case 'search':
      return process.env.NEXT_PUBLIC_SEARCH_URL || '';
    case 'inventory':
      return process.env.NEXT_PUBLIC_INVENTORY_URL || '';
    default:
      return process.env.NEXT_PUBLIC_USER_URL || '';
  }
};

const apiClient: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token, cache headers, and set the base URL
apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // Set the base URL based on the service
    config.baseURL = getBaseUrl(config.service);

    // Ensure withCredentials is always true
    config.withCredentials = true;

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

// Response interceptor to handle unauthorized errors
apiClient.interceptors.response.use(
  (response) => {
    // Debug cookie handling
    console.log('Response from:', response.config.url, {
      headers: response.headers,
      cookies: document.cookie
    });
    return response;
  },
  (error: AxiosError) => {
    // Let the calling code handle the error
    return Promise.reject(error);
  }
);

// Helper functions to create service-specific clients
export const createServiceClient = (service: ServiceType) => ({
  get: <T>(url: string, config: Partial<Omit<CustomAxiosRequestConfig, 'service'>> = {}) => 
    apiClient.get<T>(url, { ...config, service } as CustomAxiosRequestConfig),
  post: <T>(url: string, data?: any, config: Partial<Omit<CustomAxiosRequestConfig, 'service'>> = {}) => 
    apiClient.post<T>(url, data, { ...config, service } as CustomAxiosRequestConfig),
  put: <T>(url: string, data?: any, config: Partial<Omit<CustomAxiosRequestConfig, 'service'>> = {}) => 
    apiClient.put<T>(url, data, { ...config, service } as CustomAxiosRequestConfig),
  delete: <T>(url: string, config: Partial<Omit<CustomAxiosRequestConfig, 'service'>> = {}) => 
    apiClient.delete<T>(url, { ...config, service } as CustomAxiosRequestConfig),
  patch: <T>(url: string, data?: any, config: Partial<Omit<CustomAxiosRequestConfig, 'service'>> = {}) => 
    apiClient.patch<T>(url, data, { ...config, service } as CustomAxiosRequestConfig)
});

// Default client (uses 'user' service)
export default apiClient; 