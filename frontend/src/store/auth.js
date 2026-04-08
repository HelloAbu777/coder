import { defineStore } from 'pinia';
import api from '../utils/axios.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isStudent: (state) => state.user?.role === 'student',
    isMentor: (state) => state.user?.role === 'mentor',
    isAdmin: (state) => state.user?.role === 'admin',
    isPaid: (state) => state.user?.isPaid
  },

  actions: {
    init() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    },

    async register(name, email, password) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/register', { name, email, password });
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Xato yuz berdi';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/login', { email, password });
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Email yoki parol noto\'g\'ri';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      try {
        const { data } = await api.get('/auth/me');
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
      } catch (_) {}
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});
