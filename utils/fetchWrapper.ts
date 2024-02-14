import axios, { AxiosRequestConfig } from 'axios';

export const fetchWithToken = async (url: string, options: AxiosRequestConfig = {}) => {
  // Retrieve the token from local storage
  const token = localStorage.getItem('token');
  
  // Ensure existing headers are not overwritten
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  // Make the request with axios and merged headers
  try {
    const response = await axios({
      url,
      ...options,
      headers,
    });
    return response;
  } catch (error) {
    // Handle or throw axios errors
    throw error;
  }
};
