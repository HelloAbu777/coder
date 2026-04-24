import axios from 'axios';

// Development: Vite proxy ishlatadi (/api -> http://localhost:5000/api)
// Production: VITE_API_URL ishlatadi
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || 'https://coder-backend.onrender.com/api')
    : '/api'
});

// Har bir so'rovga token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 da login sahifasiga yo'naltirish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
