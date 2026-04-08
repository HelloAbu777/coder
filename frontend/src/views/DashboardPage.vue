<template>
  <div class="container py-5">
    <div class="row g-4">
      <!-- Xush kelibsiz -->
      <div class="col-12">
        <div class="card-dark p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h3 class="fw-bold mb-1" style="color:var(--text-light)">Xush kelibsiz, {{ user?.name }}!</h3>
            <p class="mb-0 small" style="color:var(--text-muted)">O'qishni davom eting</p>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="text-center">
              <span class="badge px-3 py-2 fs-6" :class="`badge-${user?.level?.toLowerCase()}`">
                {{ user?.level }}
              </span>
            </div>
            <div class="text-center">
              <div class="fw-bold fs-5" style="color:var(--primary)">{{ user?.totalScore || 0 }}</div>
              <div class="small" style="color:var(--text-muted)">Umumiy ball</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress -->
      <div class="col-md-8">
        <div class="card-dark p-4 h-100">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">Progress</h5>
          <div class="d-flex flex-column gap-3">
            <ProgressBar v-for="s in sections" :key="s.name" :value="s.progress" :label="s.name" />
          </div>
          <div class="mt-4">
            <RouterLink to="/videos" class="btn btn-primary btn-sm">
              <i class="bi bi-play-circle me-2"></i>Davom etish
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="col-md-4">
        <div class="d-flex flex-column gap-3 h-100">
          <div v-for="stat in stats" :key="stat.label" class="card-dark p-3 text-center flex-grow-1">
            <i :class="stat.icon" class="fs-2 mb-2 d-block" style="color:var(--primary)"></i>
            <div class="fw-bold fs-5" style="color:var(--text-light)">{{ stat.value }}</div>
            <div class="small" style="color:var(--text-muted)">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="col-md-6">
        <div class="card-dark p-4">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">
            <i class="bi bi-trophy me-2" style="color:var(--warning)"></i>Leaderboard
          </h5>
          <div v-if="leaderboard.length === 0" class="text-center py-3" style="color:var(--text-muted)">Yuklanmoqda...</div>
          <div v-for="(u, i) in leaderboard" :key="u._id" class="d-flex align-items-center gap-3 mb-3">
            <div class="fw-bold" style="width:24px;color:var(--text-muted)">{{ i + 1 }}</div>
            <div class="rounded-circle d-flex align-items-center justify-content-center"
              style="width:36px;height:36px;background:var(--bg-card2);color:var(--primary);font-size:0.9rem;font-weight:700;flex-shrink:0">
              {{ u.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-grow-1">
              <div class="small fw-semibold" style="color:var(--text-light)">{{ u.name }}</div>
              <div class="small" style="color:var(--text-muted)">{{ u.totalScore }} ball</div>
            </div>
            <span class="badge" :class="`badge-${u.level?.toLowerCase()}`">{{ u.level }}</span>
          </div>
        </div>
      </div>

      <!-- Sertifikatlar -->
      <div class="col-md-6">
        <div class="card-dark p-4">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">
            <i class="bi bi-award me-2" style="color:var(--primary)"></i>Sertifikatlarim
          </h5>
          <div v-if="certificates.length === 0" class="text-center py-3" style="color:var(--text-muted)">
            <i class="bi bi-award fs-2 d-block mb-2"></i>Hali sertifikat yo'q
          </div>
          <div v-for="cert in certificates" :key="cert._id" class="d-flex align-items-center gap-3 mb-3">
            <i class="bi bi-award-fill fs-4" style="color:var(--primary)"></i>
            <div class="flex-grow-1">
              <div class="small fw-semibold" style="color:var(--text-light)">{{ cert.section }}</div>
              <div class="small" style="color:var(--text-muted)">{{ new Date(cert.issuedAt).toLocaleDateString('uz-UZ') }}</div>
            </div>
            <a v-if="cert.pdfUrl" :href="cert.pdfUrl" target="_blank" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-download"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import ProgressBar from '../components/ProgressBar.vue';
import { useAuthStore } from '../store/auth.js';
import api from '../utils/axios.js';

export default {
  name: 'DashboardPage',
  components: { ProgressBar },
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);
    const leaderboard = ref([]);
    const certificates = ref([]);

    const sectionTotals = { HTML: 10, CSS: 12, JavaScript: 20, 'Node.js': 15, Python: 18 };

    const sections = computed(() => {
      return Object.entries(sectionTotals).map(([name, total]) => {
        const done = user.value?.completedVideos?.length || 0;
        return { name, progress: Math.min(100, Math.round((done / total) * 100)) };
      });
    });

    const stats = computed(() => [
      { icon: 'bi bi-play-circle', value: user.value?.completedVideos?.length || 0, label: 'Ko\'rilgan darslar' },
      { icon: 'bi bi-patch-check', value: user.value?.completedQuizzes?.length || 0, label: 'O\'tilgan testlar' },
      { icon: 'bi bi-check-circle', value: user.value?.completedSections?.length || 0, label: 'Tugallangan bo\'limlar' }
    ]);

    onMounted(async () => {
      try {
        const [lbRes, certRes] = await Promise.all([
          api.get('/profile/leaderboard'),
          api.get('/certificates')
        ]);
        leaderboard.value = lbRes.data;
        certificates.value = certRes.data;
      } catch (_) {}
    });

    return { user, sections, stats, leaderboard, certificates };
  }
};
</script>
