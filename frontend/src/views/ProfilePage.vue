<template>
  <div class="container py-5" style="max-width:800px">
    <div v-if="loading" class="text-center py-5" style="color:var(--text-muted)">
      <div class="spinner-border mb-3" style="color:var(--primary)"></div>
      <p>Yuklanmoqda...</p>
    </div>

    <div v-else-if="profile">
      <!-- Profil header -->
      <div class="profile-header card-dark p-4 mb-4">
        <div class="d-flex align-items-center gap-4 flex-wrap">
          <div class="profile-avatar">{{ profile.user?.name?.charAt(0)?.toUpperCase() }}</div>
          <div class="flex-grow-1">
            <h3 class="fw-bold mb-1" style="color:var(--text-light)">{{ profile.user?.name }}</h3>
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="badge px-3 py-1" :class="`badge-${profile.user?.level?.toLowerCase()}`">
                {{ profile.user?.level }}
              </span>
              <span class="small" style="color:var(--text-muted)">
                <i class="bi bi-calendar3 me-1"></i>
                {{ new Date(profile.user?.createdAt).toLocaleDateString('uz-UZ') }} dan beri
              </span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="row g-3 mt-3">
          <div v-for="s in stats" :key="s.label" class="col-4">
            <div class="text-center">
              <div class="fw-bold fs-5" style="color:var(--primary)">{{ s.value }}</div>
              <div class="small" style="color:var(--text-muted)">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tugallangan bo'limlar -->
      <div class="card-dark p-4 mb-4">
        <h5 class="fw-semibold mb-3" style="color:var(--text-light)">
          <i class="bi bi-check-circle me-2" style="color:var(--primary)"></i>Tugallangan bo'limlar
        </h5>
        <div v-if="profile.user?.completedSections?.length === 0" style="color:var(--text-muted)" class="small">
          Hali bo'lim tugallanmagan
        </div>
        <div class="d-flex flex-wrap gap-2">
          <span v-for="s in profile.user?.completedSections" :key="s"
            class="badge px-3 py-2" style="background:rgba(16,185,129,0.15);color:#6ee7b7;font-size:0.85rem">
            <i class="bi bi-check me-1"></i>{{ s }}
          </span>
        </div>
      </div>

      <!-- Sertifikatlar -->
      <div class="card-dark p-4">
        <h5 class="fw-semibold mb-3" style="color:var(--text-light)">
          <i class="bi bi-award me-2" style="color:var(--primary)"></i>Sertifikatlar
        </h5>
        <div v-if="profile.certificates?.length === 0" style="color:var(--text-muted)" class="small">
          Hali sertifikat yo'q
        </div>
        <div class="row g-3">
          <div v-for="cert in profile.certificates" :key="cert._id" class="col-md-6">
            <div class="cert-mini">
              <i class="bi bi-award-fill" style="color:#818cf8"></i>
              <div>
                <div class="fw-semibold small" style="color:var(--text-light)">{{ cert.section }}</div>
                <div class="small" style="color:var(--text-muted)">{{ new Date(cert.issuedAt).toLocaleDateString('uz-UZ') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5 card-dark">
      <i class="bi bi-person-x fs-1 d-block mb-3" style="color:var(--text-muted)"></i>
      <p style="color:var(--text-muted)">Foydalanuvchi topilmadi</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../utils/axios.js';

export default {
  name: 'ProfilePage',
  setup() {
    const route = useRoute();
    const profile = ref(null);
    const loading = ref(true);

    const stats = computed(() => [
      { value: profile.value?.user?.completedSections?.length || 0, label: "Bo'limlar" },
      { value: profile.value?.certificates?.length || 0, label: 'Sertifikatlar' },
      { value: profile.value?.user?.totalScore || 0, label: 'Ball' }
    ]);

    onMounted(async () => {
      try {
        const { data } = await api.get(`/profile/${route.params.username}`);
        profile.value = data;
      } catch (_) {} finally {
        loading.value = false;
      }
    });

    return { profile, loading, stats };
  }
};
</script>

<style scoped>
.profile-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; color: #fff;
  flex-shrink: 0;
}
.cert-mini {
  display: flex; align-items: center; gap: 0.75rem;
  background: rgba(79,70,229,0.08);
  border: 1px solid rgba(79,70,229,0.15);
  border-radius: 10px; padding: 0.75rem;
}
.cert-mini i { font-size: 1.5rem; flex-shrink: 0; }
</style>
