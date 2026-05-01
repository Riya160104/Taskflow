import axios from 'axios';

// Railway production URL – apni actual URL daal
const BASE_URL = 'https://magnificent-commitment-production-4a69.up.railway.app';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;