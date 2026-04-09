<template>
  <div class="container py-5">
    <h2 class="section-title mb-5">Sertifikatlar</h2>

    <!-- Bo'limlar holati -->
    <div class="row g-3 mb-5">
      <div v-for="s in sections" :key="s.name" class="col-md-4 col-lg-2-4">
        <div class="section-card" :class="{ done: s.completed }">
          <div class="section-icon">{{ s.icon }}</div>
          <div class="section-name">{{ s.name }}</div>
          <div v-if="s.completed" class="section-status done-text">
            <i class="bi bi-check-circle-fill me-1"></i>Tugallangan
          </div>
          <div v-else class="section-status pending-text">Davom etmoqda</div>
          <button v-if="s.completed && !s.hasCert" class="btn btn-primary btn-sm mt-2 w-100" :disabled="generating === s.name" @click="getCertificate(s.name)">
            <span v-if="generating === s.name" class="spinner-border spinner-border-sm me-1"></span>
            Sertifikat olish
          </button>
        </div>
      </div>
    </div>

    <!-- Sertifikatlar -->
    <h4 class="fw-semibold mb-4" style="color:var(--text-light)">
      <i class="bi bi-award me-2" style="color:var(--primary)"></i>
      Mening sertifikatlarim
    </h4>

    <div v-if="certificates.length === 0" class="text-center py-5 card-dark">
      <i class="bi bi-award fs-1 d-block mb-3" style="color:var(--text-muted)"></i>
      <p style="color:var(--text-muted)">Hali sertifikat yo'q. Bo'limni tugating!</p>
    </div>

    <div class="row g-4">
      <div v-for="cert in certificates" :key="cert._id" class="col-md-6 col-lg-4">
        <div class="cert-card">
          <div class="cert-header">
            <i class="bi bi-award-fill cert-icon"></i>
            <span class="cert-badge">CODERS</span>
          </div>
          <div class="cert-section">{{ cert.section }}</div>
          <div class="cert-label">Bo'limi sertifikati</div>
          <div class="cert-info">
            <span><i class="bi bi-calendar3 me-1"></i>{{ new Date(cert.issuedAt).toLocaleDateString('uz-UZ') }}</span>
            <span><i class="bi bi-hash me-1"></i>{{ cert.uniqueId?.slice(0, 8) }}...</span>
          </div>
          <a v-if="cert.pdfUrl" :href="cert.pdfUrl" target="_blank" class="btn btn-primary btn-sm w-100 mt-3">
            <i class="bi bi-download me-2"></i>PDF yuklab olish
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth.js';
import api from '../utils/axios.js';

export default {
  name: 'CertificatesPage',
  setup() {
    const authStore = useAuthStore();
    const certificates = ref([]);
    const generating = ref('');

    const sectionMeta = [
      { name: 'HTML', icon: '🌐' },
      { name: 'CSS', icon: '🎨' },
      { name: 'JavaScript', icon: '⚡' },
      { name: 'Node.js', icon: '🖥️' },
      { name: 'Python', icon: '🐍' }
    ];

    const sections = computed(() =>
      sectionMeta.map((s) => ({
        ...s,
        completed: authStore.user?.completedSections?.includes(s.name),
        hasCert: certificates.value.some((c) => c.section === s.name)
      }))
    );

    const getCertificate = async (section) => {
      generating.value = section;
      try {
        const { data } = await api.post('/certificates/generate', { section });
        certificates.value.push(data);
        await authStore.fetchMe();
      } catch (_) {} finally {
        generating.value = '';
      }
    };

    onMounted(async () => {
      try {
        const { data } = await api.get('/certificates');
        certificates.value = data;
      } catch (_) {}
    });

    return { certificates, sections, generating, getCertificate };
  }
};
</script>

<style scoped>
.section-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 12px; padding: 1.2rem; text-align: center;
  transition: all 0.2s;
}
.section-card.done { border-color: rgba(16,185,129,0.3); }
.section-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.section-name { font-weight: 700; color: var(--text-light); margin-bottom: 0.4rem; }
.section-status { font-size: 0.8rem; }
.done-text { color: #10b981; }
.pending-text { color: var(--text-muted); }

.cert-card {
  background: linear-gradient(135deg, #0f0f1e, #1a1a2e);
  border: 1px solid rgba(79,70,229,0.3);
  border-radius: 16px; padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.cert-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(79,70,229,0.2); }
.cert-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.cert-icon { font-size: 2rem; color: #818cf8; }
.cert-badge { background: rgba(79,70,229,0.2); color: #a5b4fc; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
.cert-section { font-size: 1.4rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.2rem; }
.cert-label { font-size: 0.8rem; color: #64748b; margin-bottom: 1rem; }
.cert-info { display: flex; justify-content: space-between; font-size: 0.78rem; color: #64748b; }
</style>
