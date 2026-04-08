<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background:var(--bg-dark)">
    <div class="card-dark p-5" style="width:100%;max-width:420px">
      <div class="text-center mb-4">
        <div class="navbar-brand fs-3 mb-2">CODERS</div>
        <p class="small" style="color:var(--text-muted)">Hisobingizga kiring</p>
      </div>

      <div v-if="error" class="alert-dark-danger p-3 mb-4 small">{{ error }}</div>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label small" style="color:var(--text-muted)">Email</label>
          <input v-model="form.email" type="email" class="form-control" placeholder="email@example.com" required />
        </div>
        <div class="mb-4">
          <label class="form-label small" style="color:var(--text-muted)">Parol</label>
          <input v-model="form.password" type="password" class="form-control" placeholder="••••••••" required />
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
          Kirish
        </button>
      </form>

      <p class="text-center mt-4 small" style="color:var(--text-muted)">
        Hisobingiz yo'qmi?
        <RouterLink to="/register" style="color:var(--primary)">Ro'yxatdan o'ting</RouterLink>
      </p>
      <p class="text-center mt-1">
        <RouterLink to="/" class="small" style="color:var(--text-muted)">
          <i class="bi bi-arrow-left me-1"></i>Bosh sahifa
        </RouterLink>
      </p>
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

    const submit = async () => {
      error.value = '';
      try {
        const data = await authStore.login(form.email, form.password);
        if (data.user.role === 'admin') return router.push('/admin');
        if (data.user.role === 'mentor') return router.push('/mentor');
        if (!data.user.isPaid) return router.push('/payment');
        router.push('/dashboard');
      } catch (err) {
        error.value = err.response?.data?.message || 'Xato yuz berdi';
      }
    };

    return { authStore, form, error, submit };
  }
};
</script>
