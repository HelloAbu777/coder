<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="auth-orb auth-orb-1"></div>
      <div class="auth-orb auth-orb-2"></div>
      <div class="auth-grid"></div>
    </div>

    <div class="auth-left d-none d-lg-flex">
      <div class="auth-brand">
        <div class="auth-logo">CODERS</div>
        <h2 class="auth-slogan">Dasturlash<br>yo'lingizni<br><span>bugun boshlang</span></h2>
        <div class="steps">
          <div v-for="(s,i) in steps" :key="s" class="step-item">
            <div class="step-num">{{ i+1 }}</div>
            <span>{{ s }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-card-header">
          <RouterLink to="/" class="auth-logo-small">CODERS</RouterLink>
          <h4 class="auth-title">Hisob yarating</h4>
          <p class="auth-subtitle">Bir martalik — umrbod kirish</p>
        </div>

        <div v-if="error" class="auth-error">
          <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
        </div>

        <form @submit.prevent="submit" class="auth-form">
          <div class="auth-field">
            <label>Ism</label>
            <div class="auth-input-wrap">
              <i class="bi bi-person"></i>
              <input v-model="form.name" type="text" placeholder="Ismingiz" required />
            </div>
          </div>
          <div class="auth-field">
            <label>Username <span class="username-hint">— boshqalar siz bilan chat ochish uchun ishlatadi</span></label>
            <div class="auth-input-wrap" :class="{ 'input-error': usernameError, 'input-ok': usernameOk }">
              <i class="bi bi-at"></i>
              <input
                v-model="form.username"
                type="text"
                placeholder="masalan: ali_karimov"
                @input="onUsernameInput"
                required
              />
              <span v-if="checkingUsername" class="check-spinner spinner-border spinner-border-sm"></span>
              <i v-else-if="usernameOk" class="bi bi-check-circle-fill check-ok"></i>
              <i v-else-if="usernameError" class="bi bi-x-circle-fill check-err"></i>
            </div>
            <div v-if="usernameError" class="field-error">{{ usernameError }}</div>
            <div v-else-if="usernameOk" class="field-ok">Ishlatish mumkin!</div>
          </div>
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
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Kamida 6 belgi" required minlength="6" />
              <button type="button" class="pass-toggle" @click="showPass = !showPass">
                <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <button type="submit" class="auth-submit" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            <span v-else><i class="bi bi-person-plus me-2"></i></span>
            Ro'yxatdan o'tish
          </button>
        </form>

        <p class="auth-switch">
          Hisobingiz bormi?
          <RouterLink to="/login">Kirish</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../store/auth.js';
import { useRouter } from 'vue-router';
import api from '../utils/axios.js';

export default {
  name: 'RegisterPage',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const form = reactive({ name: '', username: '', email: '', password: '' });
    const error = ref('');
    const showPass = ref(false);
    const usernameError = ref('');
    const usernameOk = ref(false);
    const checkingUsername = ref(false);
    let debounceTimer = null;

    const steps = ['Ro\'yxatdan o\'ting', 'To\'lov qiling (299,000 so\'m)', 'O\'qishni boshlang'];

    const onUsernameInput = () => {
      usernameOk.value = false;
      usernameError.value = '';
      clearTimeout(debounceTimer);

      const val = form.username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      form.username = val;

      if (!val) return;
      if (val.length < 3) { usernameError.value = 'Kamida 3 belgi'; return; }
      if (!/^[a-z]/.test(val)) { usernameError.value = 'Harf bilan boshlanishi kerak'; return; }

      checkingUsername.value = true;
      debounceTimer = setTimeout(async () => {
        try {
          await api.get(`/auth/check-username?username=${val}`);
          usernameOk.value = true;
          usernameError.value = '';
        } catch (err) {
          usernameError.value = err.response?.data?.message || 'Band';
          usernameOk.value = false;
        } finally {
          checkingUsername.value = false;
        }
      }, 500);
    };

    const submit = async () => {
      if (usernameError.value) return;
      error.value = '';
      try {
        await authStore.register(form.name, form.username, form.email, form.password);
        router.push('/payment');
      } catch (err) {
        error.value = err.response?.data?.message || 'Xato yuz berdi';
      }
    };

    return { authStore, form, error, showPass, steps, usernameError, usernameOk, checkingUsername, onUsernameInput, submit };
  }
};
</script>

<style scoped>
.auth-page { min-height:100vh;display:flex;background:#08080f;position:relative;overflow:hidden; }
.auth-bg { position:absolute;inset:0;z-index:0; }
.auth-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(79,70,229,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,0.04) 1px,transparent 1px);background-size:40px 40px; }
.auth-orb { position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none; }
.auth-orb-1 { width:400px;height:400px;background:rgba(124,58,237,0.12);top:-100px;left:0;animation:orbFloat 8s ease-in-out infinite; }
.auth-orb-2 { width:300px;height:300px;background:rgba(79,70,229,0.08);bottom:0;right:0;animation:orbFloat 10s ease-in-out infinite reverse; }
.auth-left { flex:1;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;padding:3rem; }
.auth-brand { max-width:420px; }
.auth-logo { font-size:2rem;font-weight:900;letter-spacing:3px;background:linear-gradient(135deg,#4f46e5,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:2rem; }
.auth-slogan { font-size:2.5rem;font-weight:800;color:#fff;line-height:1.2;margin-bottom:2rem; }
.auth-slogan span { background:linear-gradient(135deg,#4f46e5,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
.steps { display:flex;flex-direction:column;gap:1rem; }
.step-item { display:flex;align-items:center;gap:1rem;color:#94a3b8; }
.step-num { width:32px;height:32px;background:rgba(79,70,229,0.2);border:1px solid rgba(79,70,229,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#818cf8;flex-shrink:0; }
.auth-right { width:100%;max-width:480px;display:flex;align-items:center;justify-content:center;padding:2rem;position:relative;z-index:1; }
@media(min-width:992px) { .auth-right { border-left:1px solid rgba(79,70,229,0.1); } }
.auth-card { width:100%; }
.auth-card-header { margin-bottom:2rem; }
.auth-logo-small { display:inline-block;font-size:1.2rem;font-weight:900;background:linear-gradient(135deg,#4f46e5,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:1.5rem;text-decoration:none;letter-spacing:2px; }
.auth-title { font-size:1.8rem;font-weight:800;color:#f1f5f9;margin-bottom:0.3rem; }
.auth-subtitle { color:#64748b;font-size:0.95rem; }
.auth-error { background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#fca5a5;border-radius:10px;padding:0.75rem 1rem;font-size:0.9rem;margin-bottom:1.5rem; }
.auth-form { display:flex;flex-direction:column;gap:1.2rem; }
.auth-field label { display:block;color:#94a3b8;font-size:0.85rem;margin-bottom:0.5rem; }
.auth-input-wrap { display:flex;align-items:center;background:rgba(20,20,35,0.8);border:1px solid rgba(79,70,229,0.2);border-radius:10px;padding:0 1rem;transition:border-color 0.2s; }
.auth-input-wrap:focus-within { border-color:#4f46e5;box-shadow:0 0 0 3px rgba(79,70,229,0.1); }
.auth-input-wrap i { color:#4f46e5;font-size:0.9rem;flex-shrink:0; }
.auth-input-wrap input { flex:1;background:transparent;border:none;outline:none;color:#f1f5f9;padding:0.85rem 0.75rem;font-size:0.95rem; }
.auth-input-wrap input::placeholder { color:#475569; }
.pass-toggle { background:none;border:none;color:#64748b;padding:0;cursor:pointer; }
.pass-toggle:hover { color:#4f46e5; }
.auth-submit { width:100%;padding:0.9rem;background:linear-gradient(135deg,#4f46e5,#7c3aed);border:none;border-radius:10px;color:#fff;font-weight:700;font-size:1rem;cursor:pointer;transition:opacity 0.2s,transform 0.1s;margin-top:0.5rem; }
.auth-submit:hover:not(:disabled) { opacity:0.9;transform:translateY(-1px); }
.auth-submit:disabled { opacity:0.6;cursor:not-allowed; }
.auth-switch { text-align:center;color:#64748b;font-size:0.9rem;margin-top:1.5rem; }
.auth-switch a { color:#818cf8;text-decoration:none;font-weight:600; }
@keyframes orbFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-25px); } }
.username-hint { font-size:0.75rem; color:#475569; font-weight:400; }
.input-error { border-color:rgba(239,68,68,0.5) !important; }
.input-ok { border-color:rgba(16,185,129,0.5) !important; }
.check-ok { color:#10b981; font-size:0.9rem; }
.check-err { color:#ef4444; font-size:0.9rem; }
.check-spinner { color:#818cf8; }
.field-error { font-size:0.78rem; color:#fca5a5; margin-top:0.3rem; padding-left:0.25rem; }
.field-ok { font-size:0.78rem; color:#6ee7b7; margin-top:0.3rem; padding-left:0.25rem; }
</style>
