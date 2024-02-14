export const fetchWithToken = async (url: string, options: RequestInit & { headers?: Record<string, string> } = {}) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');
    
    // Ensure existing headers are not overwritten
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  
    // Include the token in the headers for the outgoing request
    const response = await fetch(url, { ...options, headers });
    return response;
  };
  