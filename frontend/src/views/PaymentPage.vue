<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background:var(--bg-dark)">
    <div class="card-dark p-5 text-center" style="width:100%;max-width:480px">
      <div class="navbar-brand fs-3 mb-4">CODERS</div>
      <h4 class="fw-bold mb-2" style="color:var(--text-light)">Kursga kirish</h4>
      <p class="mb-4 small" style="color:var(--text-muted)">Barcha darslarga to'liq kirish</p>

      <div class="card-dark p-4 mb-5" style="border-color:var(--primary)">
        <div class="display-6 fw-bold mb-1" style="color:var(--primary)">299,000 so'm</div>
        <div class="small mb-3" style="color:var(--text-muted)">Bir martalik — umrbod kirish</div>
        <ul class="list-unstyled text-start small mb-0">
          <li class="mb-1" style="color:var(--text-light)"><i class="bi bi-check-circle-fill me-2" style="color:var(--success)"></i>75+ video dars</li>
          <li class="mb-1" style="color:var(--text-light)"><i class="bi bi-check-circle-fill me-2" style="color:var(--success)"></i>Barcha testlar va sertifikatlar</li>
          <li style="color:var(--text-light)"><i class="bi bi-check-circle-fill me-2" style="color:var(--success)"></i>Mentor yordami</li>
        </ul>
      </div>

      <div v-if="error" class="alert-dark-danger p-3 mb-4 small">{{ error }}</div>
      <div v-if="success" class="alert-dark-success p-3 mb-4 small">
        <i class="bi bi-check-circle me-2"></i>Muvaffaqiyatli! Yo'naltirilmoqda...
      </div>

      <!-- Test rejim tugmasi -->
      <button
        class="btn btn-primary w-100 btn-lg mb-3"
        :disabled="loading"
        @click="testActivate">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-check-circle me-2"></i>
        To'ladim — Kirish
      </button>

      <p class="small" style="color:var(--text-muted)">
        <i class="bi bi-info-circle me-1"></i>
        To'lov tizimi (Payme, Click) tez orada ulangach ishlaydi
      </p>

      <button class="btn btn-link mt-3 small" style="color:var(--text-muted)" @click="logout">
        <i class="bi bi-box-arrow-left me-1"></i>Chiqish
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '../utils/axios.js';
import { useAuthStore } from '../store/auth.js';
import { useRouter } from 'vue-router';

export default {
  name: 'PaymentPage',
  setup() {
    const loading = ref(false);
    const error = ref('');
    const success = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const testActivate = async () => {
      loading.value = true;
      error.value = '';
      try {
        await api.post('/payment/test-activate');
        await authStore.fetchMe();
        success.value = true;
        setTimeout(() => router.push('/dashboard'), 1500);
      } catch (err) {
        error.value = err.response?.data?.message || 'Xato yuz berdi';
      } finally {
        loading.value = false;
      }
    };

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    return { loading, error, success, testActivate, logout };
  }
};
</script>
