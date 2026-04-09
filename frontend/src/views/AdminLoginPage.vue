<template>
  <div class="admin-login-wrap">
    <!-- Background grid -->
    <div class="bg-grid"></div>

    <div class="admin-login-box">
      <!-- Logo -->
      <div class="admin-logo">
        <div class="logo-icon"><i class="bi bi-shield-lock-fill"></i></div>
        <div>
          <div class="logo-title">CODERS</div>
          <div class="logo-sub">Admin Panel</div>
        </div>
      </div>

      <h2 class="al-title">Admin kirish</h2>
      <p class="al-desc">Bu sahifa faqat adminlar uchun</p>

      <form @submit.prevent="handleLogin">
        <div class="al-field">
          <label>Email</label>
          <div class="al-input-wrap">
            <i class="bi bi-envelope"></i>
            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              autocomplete="username"
              required
            />
          </div>
        </div>

        <div class="al-field">
          <label>Parol</label>
          <div class="al-input-wrap">
            <i class="bi bi-lock"></i>
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button type="button" class="eye-btn" @click="showPass = !showPass">
              <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="error" class="al-error">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
        </div>

        <button type="submit" class="al-btn" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-box-arrow-in-right me-2"></i>
          {{ loading ? 'Kirish...' : 'Kirish' }}
        </button>
      </form>

      <div class="al-back">
        <RouterLink to="/">
          <i class="bi bi-arrow-left me-1"></i>Asosiy saytga qaytish
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/axios.js';

export default {
  name: 'AdminLoginPage',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);
    const showPass = ref(false);

    const handleLogin = async () => {
      error.value = '';
      loading.value = true;
      try {
        const { data } = await api.post('/auth/login', {
          email: email.value,
          password: password.value
        });

        if (data.user?.role !== 'admin') {
          error.value = 'Sizda admin huquqi yo\'q';
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/admin');
      } catch (err) {
        error.value = err.response?.data?.message || 'Login xatosi';
      } finally {
        loading.value = false;
      }
    };

    return { email, password, error, loading, showPass, handleLogin };
  }
};
</script>

<style scoped>
.admin-login-wrap {
  min-height: 100vh;
  background: #05050f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(79,70,229,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79,70,229,0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.admin-login-box {
  background: rgba(15,15,30,0.95);
  border: 1px solid rgba(79,70,229,0.25);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 60px rgba(79,70,229,0.12);
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #fff;
  flex-shrink: 0;
}

.logo-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: 0.05em;
}

.logo-sub {
  font-size: 0.75rem;
  color: #818cf8;
  font-weight: 500;
}

.al-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.3rem;
}

.al-desc {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1.75rem;
}

.al-field {
  margin-bottom: 1.25rem;
}

.al-field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 0.45rem;
}

.al-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(79,70,229,0.2);
  border-radius: 10px;
  padding: 0.7rem 1rem;
  transition: border-color 0.2s;
}

.al-input-wrap:focus-within {
  border-color: rgba(79,70,229,0.6);
  background: rgba(79,70,229,0.05);
}

.al-input-wrap > i {
  color: #4f46e5;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.al-input-wrap input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-size: 0.95rem;
}

.al-input-wrap input::placeholder { color: #475569; }

.eye-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.eye-btn:hover { color: #818cf8; }

.al-error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  color: #fca5a5;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.al-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.al-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.al-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.al-back {
  text-align: center;
  margin-top: 1.5rem;
}

.al-back a {
  color: #64748b;
  font-size: 0.82rem;
  text-decoration: none;
  transition: color 0.2s;
}

.al-back a:hover { color: #818cf8; }
</style>
