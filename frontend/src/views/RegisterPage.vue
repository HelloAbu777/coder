<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background:var(--bg-dark)">
    <div class="card-dark p-5" style="width:100%;max-width:420px">
      <div class="text-center mb-4">
        <div class="navbar-brand fs-3 mb-2">CODERS</div>
        <p class="small" style="color:var(--text-muted)">Yangi hisob yarating</p>
      </div>

      <div v-if="error" class="alert-dark-danger p-3 mb-4 small">{{ error }}</div>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label small" style="color:var(--text-muted)">Ism</label>
          <input v-model="form.name" type="text" class="form-control" placeholder="Ismingiz" required />
        </div>
        <div class="mb-3">
          <label class="form-label small" style="color:var(--text-muted)">Email</label>
          <input v-model="form.email" type="email" class="form-control" placeholder="email@example.com" required />
        </div>
        <div class="mb-4">
          <label class="form-label small" style="color:var(--text-muted)">Parol</label>
          <input v-model="form.password" type="password" class="form-control" placeholder="Kamida 6 belgi" required minlength="6" />
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
          Ro'yxatdan o'tish
        </button>
      </form>

      <p class="text-center mt-4 small" style="color:var(--text-muted)">
        Hisobingiz bormi?
        <RouterLink to="/login" style="color:var(--primary)">Kirish</RouterLink>
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../store/auth.js';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterPage',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const form = reactive({ name: '', email: '', password: '' });
    const error = ref('');

    const submit = async () => {
      error.value = '';
      try {
        await authStore.register(form.name, form.email, form.password);
        router.push('/payment');
      } catch (err) {
        error.value = err.response?.data?.message || 'Xato yuz berdi';
      }
    };

    return { authStore, form, error, submit };
  }
};
</script>
