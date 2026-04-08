<template>
  <div class="container py-5">
    <h2 class="section-title mb-5">Sertifikatlar</h2>

    <!-- Bo'limlar holati -->
    <div class="row g-4 mb-5">
      <div v-for="s in sectionStatus" :key="s.name" class="col-md-4 col-lg-2-4">
        <div class="card-dark p-4 text-center h-100">
          <div class="fs-1 mb-3">{{ s.icon }}</div>
          <h6 class="fw-semibold mb-2" style="color:var(--text-light)">{{ s.name }}</h6>
          <div v-if="s.hasCert">
            <span class="badge px-3 py-2 mb-3 d-block" style="background:rgba(16,185,129,0.2);color:#6ee7b7">
              <i class="bi bi-check-circle me-1"></i>Sertifikat bor
            </span>
            <a v-if="s.pdfUrl" :href="s.pdfUrl" target="_blank" class="btn btn-sm btn-outline-primary w-100">
              <i class="bi bi-download me-1"></i>Yuklab olish
            </a>
          </div>
          <div v-else-if="s.canGenerate">
            <button class="btn btn-sm btn-primary w-100" :disabled="generating === s.name" @click="generate(s.name)">
              <span v-if="generating === s.name" class="spinner-border spinner-border-sm me-1"></span>
              Sertifikat olish
            </button>
          </div>
          <div v-else>
            <span class="badge px-3 py-2 d-block" style="background:rgba(148,163,184,0.1);color:var(--text-muted)">
              <i class="bi bi-lock me-1"></i>Checkpoint kerak
            </span>
            <div class="small mt-2" style="color:var(--text-muted)">85+ ball bilan checkpoint o'ting</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sertifikatlar ro'yxati -->
    <div v-if="certificates.length > 0">
      <h4 class="fw-semibold mb-4" style="color:var(--text-light)">Mening sertifikatlarim</h4>
      <div class="row g-4">
        <div v-for="cert in certificates" :key="cert._id" class="col-md-6">
          <div class="card-dark p-4 d-flex align-items-center gap-4">
            <i class="bi bi-award-fill flex-shrink-0" style="font-size:3rem;color:var(--primary)"></i>
            <div class="flex-grow-1">
              <h5 class="fw-bold mb-1" style="color:var(--text-light)">{{ cert.section }}</h5>
              <p class="small mb-1" style="color:var(--text-muted)">
                {{ new Date(cert.issuedAt).toLocaleDateString('uz-UZ') }}
              </p>
              <p class="small mb-2" style="color:var(--text-muted);font-family:monospace">
                ID: {{ cert.uniqueId?.slice(0, 12) }}...
              </p>
              <a v-if="cert.pdfUrl" :href="cert.pdfUrl" target="_blank" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-download me-1"></i>PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center py-5" style="color:var(--text-muted)">
      <i class="bi bi-award fs-1 d-block mb-3"></i>
      <p>Hali sertifikat yo'q. Bo'limlarni tugatib checkpoint testni o'ting!</p>
      <RouterLink to="/videos" class="btn btn-primary">Darslarga o'tish</RouterLink>
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
    const loading = ref(true);
    const generating = ref('');

    const sections = [
      { name: 'HTML', icon: '🌐' },
      { name: 'CSS', icon: '🎨' },
      { name: 'JavaScript', icon: '⚡' },
      { name: 'Node.js', icon: '🖥️' },
      { name: 'Python', icon: '🐍' }
    ];

    const sectionStatus = computed(() =>
      sections.map((s) => {
        const cert = certificates.value.find((c) => c.section === s.name);
        const completed = authStore.user?.completedSections?.includes(s.name);
        return {
          ...s,
          hasCert: !!cert,
          pdfUrl: cert?.pdfUrl || '',
          canGenerate: completed && !cert
        };
      })
    );

    const generate = async (section) => {
      generating.value = section;
      try {
        const { data } = await api.post('/certificates/generate', { section });
        certificates.value.push(data);
        await authStore.fetchMe();
      } catch (err) {
        alert(err.response?.data?.message || 'Xato yuz berdi');
      } finally {
        generating.value = '';
      }
    };

    onMounted(async () => {
      try {
        const { data } = await api.get('/certificates');
        certificates.value = data;
      } catch (_) {} finally {
        loading.value = false;
      }
    });

    return { certificates, loading, generating, sectionStatus, generate };
  }
};
</script>
