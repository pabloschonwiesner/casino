import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.error('Rate limit exceeded');
 
      window.dispatchEvent(
        new CustomEvent('api:rate-limited', {
          detail: {
            message: 'Too many requests. Please wait a moment and try again.',
          },
        })
      );
    }
 
    return Promise.reject(error);
  }
);

export default apiClient;
