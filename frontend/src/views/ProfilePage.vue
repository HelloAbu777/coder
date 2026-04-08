<template>
  <div class="container py-5" style="max-width:700px">
    <div v-if="loading" class="text-center py-5" style="color:var(--text-muted)">
      <div class="spinner-border mb-3" style="color:var(--primary)"></div>
    </div>

    <div v-else-if="profile">
      <!-- Profil sarlavha -->
      <div class="card-dark p-5 text-center mb-4">
        <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style="width:80px;height:80px;background:linear-gradient(135deg,#4f46e5,#7c3aed);font-size:2rem;color:#fff;font-weight:700">
          {{ profile.user.name?.charAt(0)?.toUpperCase() }}
        </div>
        <h3 class="fw-bold mb-2" style="color:var(--text-light)">{{ profile.user.name }}</h3>
        <span class="badge px-3 py-2 fs-6 mb-3 d-inline-block" :class="`badge-${profile.user.level?.toLowerCase()}`">
          {{ profile.user.level }}
        </span>
        <div class="row g-3 justify-content-center mt-2">
          <div class="col-4">
            <div class="small" style="color:var(--text-muted)">Bo'limlar</div>
            <div class="fw-bold" style="color:var(--text-light)">{{ profile.user.completedSections?.length || 0 }}</div>
          </div>
          <div class="col-4">
            <div class="small" style="color:var(--text-muted)">Sertifikatlar</div>
            <div class="fw-bold" style="color:var(--text-light)">{{ profile.certificates?.length || 0 }}</div>
          </div>
          <div class="col-4">
            <div class="small" style="color:var(--text-muted)">A'zo bo'lgan</div>
            <div class="fw-bold" style="color:var(--text-light)">{{ new Date(profile.user.createdAt).toLocaleDateString('uz-UZ') }}</div>
          </div>
        </div>
      </div>

      <!-- Tugallangan bo'limlar -->
      <div class="card-dark p-4 mb-4">
        <h5 class="fw-semibold mb-3" style="color:var(--text-light)">Tugallangan bo'limlar</h5>
        <div v-if="profile.user.completedSections?.length === 0" class="small" style="color:var(--text-muted)">
          Hali tugallangan bo'lim yo'q
        </div>
        <div class="d-flex flex-wrap gap-2">
          <span v-for="s in profile.user.completedSections" :key="s"
            class="badge px-3 py-2"
            style="background:rgba(79,70,229,0.2);color:#a5b4fc">
            {{ s }}
          </span>
        </div>
      </div>

      <!-- Sertifikatlar -->
      <div class="card-dark p-4">
        <h5 class="fw-semibold mb-3" style="color:var(--text-light)">Sertifikatlar</h5>
        <div v-if="profile.certificates?.length === 0" class="small" style="color:var(--text-muted)">
          Hali sertifikat yo'q
        </div>
        <div v-for="cert in profile.certificates" :key="cert._id"
          class="d-flex align-items-center gap-3 mb-3">
          <i class="bi bi-award-fill" style="color:var(--primary);font-size:1.5rem"></i>
          <div>
            <div class="fw-semibold small" style="color:var(--text-light)">{{ cert.section }}</div>
            <div class="small" style="color:var(--text-muted)">{{ new Date(cert.issuedAt).toLocaleDateString('uz-UZ') }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5" style="color:var(--text-muted)">
      <i class="bi bi-person-x fs-1 d-block mb-3"></i>
      <p>Foydalanuvchi topilmadi</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../utils/axios.js';
import { useRoute } from 'vue-router';

export default {
  name: 'ProfilePage',
  setup() {
    const route = useRoute();
    const profile = ref(null);
    const loading = ref(true);

    onMounted(async () => {
      try {
        const { data } = await api.get(`/profile/${route.params.username}`);
        profile.value = data;
      } catch (_) {} finally {
        loading.value = false;
      }
    });

    return { profile, loading };
  }
};
</script>
