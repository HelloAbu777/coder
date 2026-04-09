<template>
  <div class="auth-page">
    <!-- Orqa fon -->
    <div class="auth-bg">
      <div class="auth-orb auth-orb-1"></div>
      <div class="auth-orb auth-orb-2"></div>
      <div class="auth-grid"></div>
    </div>

    <!-- Chap tomon — brend -->
    <div class="auth-left d-none d-lg-flex">
      <div class="auth-brand">
        <div class="auth-logo">CODERS</div>
        <h2 class="auth-slogan">Dasturlashni<br><span>professional</span><br>darajada o'rganing</h2>
        <div class="auth-features">
          <div v-for="f in features" :key="f" class="auth-feature-item">
            <i class="bi bi-check-circle-fill"></i> {{ f }}
          </div>
        </div>
        <!-- Floating kartalar -->
        <div class="mini-card mini-card-1">
          <i class="bi bi-trophy-fill" style="color:#f59e0b"></i>
          <span>Daraja ko'tarildi!</span>
        </div>
        <div class="mini-card mini-card-2">
          <i class="bi bi-award-fill" style="color:#4f46e5"></i>
          <span>Sertifikat olindi</span>
        </div>
      </div>
    </div>

    <!-- O'ng tomon — forma -->
    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-card-header">
          <RouterLink to="/" class="auth-logo-small">CODERS</RouterLink>
          <h4 class="auth-title">Xush kelibsiz!</h4>
          <p class="auth-subtitle">Hisobingizga kiring</p>
        </div>

        <div v-if="error" class="auth-error">
          <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
        </div>

        <form @submit.prevent="submit" class="auth-form">
          <div class="auth-field">
            <label>Email</label>
            <div class="auth-input-wrap">
              <i class="bi bi-envelope"></i>
              <input v-model="form.email" type="email" placeholder="email@example.com" required />
            </div>
          </div>
          <div class="auth-field">
            <label>Parol</label>
            <div class="auth-input-wrap">
              <i class="bi bi-lock"></i>
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required />
              <button type="button" class="pass-toggle" @click="showPass = !showPass">
                <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <button type="submit" class="auth-submit" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            <span v-else><i class="bi bi-box-arrow-in-right me-2"></i></span>
            Kirish
          </button>
        </form>

        <p class="auth-switch">
          Hisobingiz yo'qmi?
          <RouterLink to="/register">Ro'yxatdan o'ting</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../store/auth.js';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const form = reactive({ email: '', password: '' });
    const error = ref('');
    const showPass = ref(false);

    const features = ['75+ video darslar', 'Testlar va sertifikatlar', 'Mentor yordami', 'Daraja tizimi'];

    const submit = async () => {
      error.value = '';
      try {
        const data = await authStore.login(form.email, form.password);
        if (data.user.role === 'admin') return router.push('/admin');
        if (data.user.role === 'mentor') return router.push('/mentor');
        if (!data.user.isPaid) return router.push('/payment');
        router.push('/dashboard');
      } catch (err) {
        error.value = err.response?.data?.message || 'Email yoki parol noto\'g\'ri';
      }
    };

    return { authStore, form, error, showPass, features, submit };
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh; display: flex;
  background: #08080f; position: relative; overflow: hidden;
}
.auth-bg { position: absolute; inset: 0; z-index: 0; }
.auth-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(79,70,229,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79,70,229,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}
.auth-orb {
  position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none;
}
.auth-orb-1 { width:400px;height:400px;background:rgba(79,70,229,0.12);top:-100px;right:0;animation:orbFloat 8s ease-in-out infinite; }
.auth-orb-2 { width:300px;height:300px;background:rgba(124,58,237,0.08);bottom:0;left:0;animation:orbFloat 10s ease-in-out infinite reverse; }

/* Chap brend */
.auth-left {
  flex: 1; position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  padding: 3rem;
}
.auth-brand { max-width: 420px; }
.auth-logo {
  font-size: 2rem; font-weight: 900; letter-spacing: 3px;
  background: linear-gradient(135deg,#4f46e5,#a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
}
.auth-slogan {
  font-size: 2.5rem; font-weight: 800; color: #fff;
  line-height: 1.2; margin-bottom: 2rem;
}
.auth-slogan span {
  background: linear-gradient(135deg,#4f46e5,#a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.auth-features { display: flex; flex-direction: column; gap: 0.8rem; }
.auth-feature-item { color: #94a3b8; font-size: 0.95rem; }
.auth-feature-item i { color: #10b981; margin-right: 8px; }

.mini-card {
  position: absolute;
  background: rgba(20,20,35,0.9);
  border: 1px solid rgba(79,70,229,0.3);
  border-radius: 12px; padding: 10px 16px;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.85rem; color: #e2e8f0;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
.mini-card-1 { bottom: 25%; left: 60%; animation: float 4s ease-in-out infinite; }
.mini-card-2 { bottom: 38%; left: 50%; animation: float 5s ease-in-out infinite reverse; }

/* O'ng forma */
.auth-right {
  width: 100%; max-width: 480px;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem; position: relative; z-index: 1;
}
@media(min-width: 992px) { .auth-right { border-left: 1px solid rgba(79,70,229,0.1); } }

.auth-card { width: 100%; }
.auth-card-header { margin-bottom: 2rem; }
.auth-logo-small {
  display: inline-block; font-size: 1.2rem; font-weight: 900;
  background: linear-gradient(135deg,#4f46e5,#a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem; text-decoration: none; letter-spacing: 2px;
}
.auth-title { font-size: 1.8rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.3rem; }
.auth-subtitle { color: #64748b; font-size: 0.95rem; }

.auth-error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #fca5a5; border-radius: 10px;
  padding: 0.75rem 1rem; font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.auth-form { display: flex; flex-direction: column; gap: 1.2rem; }
.auth-field label { display: block; color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.5rem; }
.auth-input-wrap {
  display: flex; align-items: center;
  background: rgba(20,20,35,0.8);
  border: 1px solid rgba(79,70,229,0.2);
  border-radius: 10px; padding: 0 1rem;
  transition: border-color 0.2s;
}
.auth-input-wrap:focus-within { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.auth-input-wrap i { color: #4f46e5; font-size: 0.9rem; flex-shrink: 0; }
.auth-input-wrap input {
  flex: 1; background: transparent; border: none; outline: none;
  color: #f1f5f9; padding: 0.85rem 0.75rem; font-size: 0.95rem;
}
.auth-input-wrap input::placeholder { color: #475569; }
.pass-toggle { background: none; border: none; color: #64748b; padding: 0; cursor: pointer; }
.pass-toggle:hover { color: #4f46e5; }

.auth-submit {
  width: 100%; padding: 0.9rem;
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
  border: none; border-radius: 10px;
  color: #fff; font-weight: 700; font-size: 1rem;
  cursor: pointer; transition: opacity 0.2s, transform 0.1s;
  margin-top: 0.5rem;
}
.auth-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.auth-switch { text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 1.5rem; }
.auth-switch a { color: #818cf8; text-decoration: none; font-weight: 600; }
.auth-switch a:hover { color: #a5b4fc; }

@keyframes orbFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-25px); }
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
