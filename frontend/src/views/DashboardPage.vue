<template>
  <div class="container py-5">
    <!-- Welcome banner -->
    <div class="welcome-banner mb-4">
      <div class="welcome-left">
        <div class="welcome-avatar">{{ user?.name?.charAt(0)?.toUpperCase() }}</div>
        <div>
          <h3 class="fw-bold mb-1" style="color:var(--text-light)">
            Xush kelibsiz, <span style="color:var(--primary)">{{ user?.name }}</span>!
          </h3>
          <p class="mb-0 small" style="color:var(--text-muted)">Bugun ham o'qishni davom eting</p>
        </div>
      </div>
      <div class="welcome-stats">
        <div class="ws-item">
          <div class="ws-val" style="color:var(--primary)">{{ user?.totalScore || 0 }}</div>
          <div class="ws-lbl">Umumiy ball</div>
        </div>
        <div class="ws-divider"></div>
        <div class="ws-item">
          <span class="badge px-3 py-2" :class="`badge-${user?.level?.toLowerCase()}`" style="font-size:0.9rem">
            {{ user?.level }}
          </span>
          <div class="ws-lbl mt-1">Daraja</div>
        </div>
        <RouterLink to="/videos" class="btn btn-primary ms-3">
          <i class="bi bi-play-circle me-2"></i>Davom etish
        </RouterLink>
      </div>
    </div>

    <div class="row g-4">
      <!-- Quick stats -->
      <div class="col-12">
        <div class="row g-3">
          <div v-for="stat in stats" :key="stat.label" class="col-sm-4">
            <div class="quick-stat">
              <div class="qs-icon"><i :class="stat.icon"></i></div>
              <div class="qs-val">{{ stat.value }}</div>
              <div class="qs-lbl">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress -->
      <div class="col-md-7">
        <div class="card-dark p-4 h-100">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">
            <i class="bi bi-bar-chart-line me-2" style="color:var(--primary)"></i>Bo'limlar progressi
          </h5>
          <div class="d-flex flex-column gap-3">
            <div v-for="s in sections" :key="s.name" class="section-progress">
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold" style="color:var(--text-light)">{{ s.icon }} {{ s.name }}</span>
                <span class="small" style="color:var(--text-muted)">
                  <span v-if="s.total > 0">{{ s.watched || 0 }}/{{ s.total }} dars · {{ s.progress }}%</span>
                  <span v-else>Tez kunda</span>
                </span>
              </div>
              <div class="prog-track">
                <div class="prog-fill" :style="`width:${s.progress}%`" :class="{ complete: s.progress === 100 }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="col-md-5">
        <div class="card-dark p-4 h-100">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">
            <i class="bi bi-trophy me-2" style="color:#f59e0b"></i>Reytinglar
          </h5>
          <div v-if="leaderboard.length === 0" class="text-center py-3" style="color:var(--text-muted)">
            <div class="spinner-border spinner-border-sm mb-2" style="color:var(--primary)"></div>
            <div class="small">Yuklanmoqda...</div>
          </div>
          <div v-for="(u, i) in leaderboard" :key="u._id" class="lb-row">
            <div class="lb-rank" :class="['gold','silver','bronze'][i] || ''">{{ i + 1 }}</div>
            <div class="lb-avatar">{{ u.name?.charAt(0)?.toUpperCase() }}</div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="small fw-semibold text-truncate" style="color:var(--text-light)">{{ u.name }}</div>
              <span class="badge" :class="`badge-${u.level?.toLowerCase()}`" style="font-size:0.6rem">{{ u.level }}</span>
            </div>
            <div class="lb-score">{{ u.totalScore }}</div>
          </div>
        </div>
      </div>

      <!-- Certificates -->
      <div class="col-12">
        <div class="card-dark p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-semibold mb-0" style="color:var(--text-light)">
              <i class="bi bi-award me-2" style="color:var(--primary)"></i>Sertifikatlarim
            </h5>
            <RouterLink to="/certificates" class="btn btn-sm btn-outline-primary">
              Barchasi <i class="bi bi-arrow-right ms-1"></i>
            </RouterLink>
          </div>
          <div v-if="certificates.length === 0" class="text-center py-4" style="color:var(--text-muted)">
            <i class="bi bi-award fs-2 d-block mb-2"></i>
            <p class="small mb-0">Hali sertifikat yo'q. Bo'limlarni tugating!</p>
          </div>
          <div v-else class="row g-3">
            <div v-for="cert in certificates" :key="cert._id" class="col-md-4 col-sm-6">
              <div class="cert-mini-card">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-award-fill" style="color:#818cf8;font-size:1.8rem;flex-shrink:0"></i>
                  <div class="overflow-hidden">
                    <div class="fw-semibold small text-truncate" style="color:var(--text-light)">{{ cert.section }}</div>
                    <div class="small" style="color:var(--text-muted)">{{ new Date(cert.issuedAt).toLocaleDateString('uz-UZ') }}</div>
                  </div>
                  <a v-if="cert.pdfUrl" :href="cert.pdfUrl" target="_blank" class="btn btn-sm btn-outline-primary ms-auto flex-shrink-0">
                    <i class="bi bi-download"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
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
  name: 'DashboardPage',
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);
    const leaderboard = ref([]);
    const certificates = ref([]);
    const allVideos = ref([]);

    const sectionIcons = { HTML: '🌐', CSS: '🎨', JavaScript: '⚡', 'Node.js': '🖥️', Python: '🐍' };

    // @returns {Array} — bo'limlar progressini haqiqiy videolar asosida hisoblash
    const sections = computed(() => {
      const sectionNames = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'];
      return sectionNames.map((name) => {
        const sectionVideos = allVideos.value.filter((v) => v.section === name);
        const total = sectionVideos.length;
        if (total === 0) return { name, icon: sectionIcons[name], total: 0, progress: 0 };
        const watched = sectionVideos.filter((v) =>
          user.value?.completedVideos?.includes(v._id)
        ).length;
        const progress = Math.round((watched / total) * 100);
        return { name, icon: sectionIcons[name], total, watched, progress };
      });
    });

    const stats = computed(() => [
      { icon: 'bi bi-play-circle-fill', value: user.value?.completedVideos?.length || 0, label: "Ko'rilgan darslar" },
      { icon: 'bi bi-patch-check-fill', value: user.value?.completedQuizzes?.length || 0, label: "O'tilgan testlar" },
      { icon: 'bi bi-check-circle-fill', value: user.value?.completedSections?.length || 0, label: "Tugallangan bo'limlar" }
    ]);

    onMounted(async () => {
      try {
        const [lbRes, certRes, videoRes] = await Promise.all([
          api.get('/profile/leaderboard'),
          api.get('/certificates'),
          api.get('/videos')
        ]);
        leaderboard.value = lbRes.data.slice(0, 7);
        certificates.value = certRes.data;
        allVideos.value = videoRes.data;
      } catch (_) {}
    });

    return { user, sections, stats, leaderboard, certificates };
  }
};
</script>

<style scoped>
/* Welcome banner */
.welcome-banner {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 200px; height: 100%;
  background: radial-gradient(circle at right center, rgba(79,70,229,0.1), transparent 70%);
  pointer-events: none;
}

.welcome-left { display: flex; align-items: center; gap: 1rem; }

.welcome-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.welcome-stats { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.ws-item { text-align: center; }
.ws-val { font-size: 1.5rem; font-weight: 800; }
.ws-lbl { font-size: 0.72rem; color: var(--text-muted); }
.ws-divider { width: 1px; height: 40px; background: var(--border); }

/* Quick stats */
.quick-stat {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.25rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.quick-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79,70,229,0.1); }

.qs-icon {
  width: 44px;
  height: 44px;
  background: rgba(79,70,229,0.12);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--primary);
  margin: 0 auto 0.6rem;
}

.qs-val { font-size: 1.6rem; font-weight: 800; color: var(--text-light); }
.qs-lbl { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem; }

/* Progress bars */
.prog-track {
  height: 8px;
  background: var(--bg-dark);
  border-radius: 4px;
  overflow: hidden;
}

.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.prog-fill.complete { background: linear-gradient(90deg, #10b981, #059669); }

/* Leaderboard */
.lb-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.lb-row:last-child { border-bottom: none; }

.lb-rank {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  flex-shrink: 0;
}

.lb-rank.gold { background: rgba(245,158,11,0.2); color: #f59e0b; }
.lb-rank.silver { background: rgba(148,163,184,0.2); color: #94a3b8; }
.lb-rank.bronze { background: rgba(180,83,9,0.2); color: #b45309; }

.lb-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.82rem;
  flex-shrink: 0;
}

.lb-score { font-weight: 700; color: var(--primary); font-size: 0.9rem; flex-shrink: 0; }

/* Cert mini card */
.cert-mini-card {
  background: rgba(79,70,229,0.06);
  border: 1px solid rgba(79,70,229,0.15);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  transition: border-color 0.2s;
}

.cert-mini-card:hover { border-color: rgba(79,70,229,0.35); }
</style>
