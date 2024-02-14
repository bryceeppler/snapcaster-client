import axios from 'axios';
import useAuthStore from '@/stores/authStore'; 

const axiosInstance = axios.create({
  baseURL: 'http://yourapi.com',
  // other configurations
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await useAuthStore.getState().refreshAccessToken();
      originalRequest.headers['Authorization'] = `Bearer ${useAuthStore.getState().accessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
