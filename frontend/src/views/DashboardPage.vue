<template>
  <div class="dashboard-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-left">
            <div class="hero-avatar">
              <div class="avatar-circle">
                {{ user?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="avatar-status"></div>
            </div>
            <div class="hero-text">
              <h1 class="hero-title">
                Xush kelibsiz, <span class="highlight">{{ user?.name }}</span>!
              </h1>
              <p class="hero-subtitle">Bugun ham o'qishni davom eting va yangi bilimlar oling</p>
            </div>
          </div>
          <div class="hero-right">
            <div class="hero-stats">
              <div class="stat-card primary">
                <div class="stat-icon">
                  <i class="bi bi-star-fill"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ user?.totalScore || 0 }}</div>
                  <div class="stat-label">Umumiy ball</div>
                </div>
              </div>
              <div class="stat-card secondary">
                <div class="stat-icon">
                  <i class="bi bi-trophy-fill"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-badge" :class="`level-${user?.level?.toLowerCase()}`">
                    {{ user?.level }}
                  </div>
                  <div class="stat-label">Daraja</div>
                </div>
              </div>
            </div>
            <RouterLink to="/videos" class="btn-continue">
              <i class="bi bi-play-circle-fill me-2"></i>
              <span>Davom etish</span>
              <i class="bi bi-arrow-right ms-2"></i>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-4">
      <!-- Quick Stats -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <div class="stat-item-icon" :style="{ background: stat.color }">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-item-content">
            <div class="stat-item-value">{{ stat.value }}</div>
            <div class="stat-item-label">{{ stat.label }}</div>
          </div>
          <div class="stat-item-trend">
            <i class="bi bi-arrow-up"></i>
          </div>
        </div>
      </div>

      <div class="row g-4 mt-2">
        <!-- Progress Section -->
        <div class="col-lg-8">
          <div class="content-card">
            <div class="card-header">
              <div class="card-title">
                <i class="bi bi-bar-chart-line-fill"></i>
                <span>Bo'limlar progressi</span>
              </div>
              <div class="card-badge">{{ sections.filter(s => s.progress === 100).length }}/{{ sections.length }} tugallandi</div>
            </div>
            <div class="card-body">
              <div class="progress-list">
                <div v-for="s in sections" :key="s.name" class="progress-item">
                  <div class="progress-header">
                    <div class="progress-info">
                      <span class="progress-icon">{{ s.icon }}</span>
                      <span class="progress-name">{{ s.name }}</span>
                      <span class="progress-badge" v-if="s.progress === 100">
                        <i class="bi bi-check-circle-fill"></i>
                        Tugallandi
                      </span>
                    </div>
                    <div class="progress-stats">
                      <span v-if="s.total > 0" class="progress-count">{{ s.watched || 0 }}/{{ s.total }} dars</span>
                      <span v-else class="progress-soon">Tez kunda</span>
                      <span class="progress-percent">{{ s.progress }}%</span>
                    </div>
                  </div>
                  <div class="progress-bar-wrapper">
                    <div class="progress-bar-track">
                      <div class="progress-bar-fill" 
                        :style="`width: ${s.progress}%`" 
                        :class="{ complete: s.progress === 100 }">
                        <div class="progress-bar-glow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leaderboard Section -->
        <div class="col-lg-4">
          <div class="content-card">
            <div class="card-header">
              <div class="card-title">
                <i class="bi bi-trophy-fill" style="color: #f59e0b;"></i>
                <span>Reytinglar</span>
              </div>
              <button class="card-action">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div class="card-body">
              <div v-if="leaderboard.length === 0" class="loading-state">
                <div class="spinner"></div>
                <p>Yuklanmoqda...</p>
              </div>
              <div v-else class="leaderboard-list">
                <div v-for="(u, i) in leaderboard" :key="u._id" class="leaderboard-item">
                  <div class="rank-badge" :class="getRankClass(i)">
                    <span v-if="i < 3">
                      <i class="bi bi-trophy-fill"></i>
                    </span>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <div class="user-avatar">
                    {{ u.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="user-info">
                    <div class="user-name">{{ u.name }}</div>
                    <div class="user-level" :class="`level-${u.level?.toLowerCase()}`">
                      {{ u.level }}
                    </div>
                  </div>
                  <div class="user-score">
                    <i class="bi bi-star-fill"></i>
                    {{ u.totalScore }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates Section -->
        <div class="col-12">
          <div class="content-card">
            <div class="card-header">
              <div class="card-title">
                <i class="bi bi-award-fill"></i>
                <span>Sertifikatlarim</span>
              </div>
              <RouterLink to="/certificates" class="card-link">
                Barchasi
                <i class="bi bi-arrow-right ms-1"></i>
              </RouterLink>
            </div>
            <div class="card-body">
              <div v-if="certificates.length === 0" class="empty-state">
                <div class="empty-icon">
                  <i class="bi bi-award"></i>
                </div>
                <h4>Hali sertifikat yo'q</h4>
                <p>Bo'limlarni tugating va sertifikat oling!</p>
              </div>
              <div v-else class="certificates-grid">
                <div v-for="cert in certificates" :key="cert._id" class="certificate-card">
                  <div class="cert-icon">
                    <i class="bi bi-award-fill"></i>
                  </div>
                  <div class="cert-content">
                    <div class="cert-title">{{ cert.section }}</div>
                    <div class="cert-date">
                      <i class="bi bi-calendar3 me-1"></i>
                      {{ new Date(cert.issuedAt).toLocaleDateString('uz-UZ') }}
                    </div>
                  </div>
                  <a v-if="cert.pdfUrl" :href="cert.pdfUrl" target="_blank" class="cert-download">
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
      { 
        icon: 'bi bi-play-circle-fill', 
        value: user.value?.completedVideos?.length || 0, 
        label: "Ko'rilgan darslar",
        color: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)'
      },
      { 
        icon: 'bi bi-patch-check-fill', 
        value: user.value?.completedQuizzes?.length || 0, 
        label: "O'tilgan testlar",
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      { 
        icon: 'bi bi-check-circle-fill', 
        value: user.value?.completedSections?.length || 0, 
        label: "Tugallangan bo'limlar",
        color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      }
    ]);

    const getRankClass = (index) => {
      if (index === 0) return 'rank-gold';
      if (index === 1) return 'rank-silver';
      if (index === 2) return 'rank-bronze';
      return '';
    };

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

    return { user, sections, stats, leaderboard, certificates, getRankClass };
  }
};
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
  padding: 3rem 0;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  min-width: 300px;
}

.hero-avatar {
  position: relative;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 8px 32px rgba(129, 140, 248, 0.4);
  border: 4px solid rgba(129, 140, 248, 0.2);
}

.avatar-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #10b981;
  border: 3px solid #1a1a2e;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.05rem;
  margin: 0;
}

.hero-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 140px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(129, 140, 248, 0.3);
  border-color: rgba(129, 140, 248, 0.4);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(129, 140, 248, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #818cf8;
}

.stat-card.secondary .stat-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stat-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.stat-badge.level-beginner {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
}

.stat-badge.level-intermediate {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
}

.stat-badge.level-advanced {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.btn-continue {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 8px 24px rgba(129, 140, 248, 0.4);
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(129, 140, 248, 0.5);
  color: #fff;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #818cf8 0%, #6366f1 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-item:hover {
  transform: translateY(-4px);
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 12px 32px rgba(129, 140, 248, 0.2);
}

.stat-item:hover::before {
  opacity: 1;
}

.stat-item-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
  flex-shrink: 0;
}

.stat-item-content {
  flex: 1;
}

.stat-item-value {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 0.375rem;
}

.stat-item-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.stat-item-trend {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

/* Content Card */
.content-card {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
  background: rgba(129, 140, 248, 0.03);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.card-title i {
  font-size: 1.25rem;
  color: #818cf8;
}

.card-badge {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-action {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(129, 140, 248, 0.1);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.card-action:hover {
  background: rgba(129, 140, 248, 0.2);
  color: #fff;
  transform: rotate(180deg);
}

.card-link {
  color: #818cf8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.card-link:hover {
  color: #a5b4fc;
  gap: 0.5rem;
}

.card-body {
  padding: 1.75rem;
  flex: 1;
  overflow-y: auto;
}

.card-body::-webkit-scrollbar {
  width: 6px;
}

.card-body::-webkit-scrollbar-track {
  background: rgba(129, 140, 248, 0.05);
}

.card-body::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.2);
  border-radius: 3px;
}

/* Progress List */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.progress-icon {
  font-size: 1.5rem;
}

.progress-name {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.progress-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
}

.progress-count {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.progress-soon {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.progress-percent {
  color: #818cf8;
  font-weight: 700;
  font-size: 0.95rem;
}

.progress-bar-wrapper {
  position: relative;
}

.progress-bar-track {
  height: 10px;
  background: rgba(15, 15, 30, 0.8);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%);
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar-fill.complete {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.progress-bar-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  to {
    left: 100%;
  }
}

/* Leaderboard */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(129, 140, 248, 0.2);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem;
  background: rgba(129, 140, 248, 0.03);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 12px;
  transition: all 0.2s;
}

.leaderboard-item:hover {
  background: rgba(129, 140, 248, 0.08);
  border-color: rgba(129, 140, 248, 0.2);
  transform: translateX(4px);
}

.rank-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(129, 140, 248, 0.1);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.rank-badge.rank-gold {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
}

.rank-badge.rank-silver {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(148, 163, 184, 0.4);
}

.rank-badge.rank-bronze {
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(180, 83, 9, 0.4);
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.user-level {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  display: inline-block;
  font-weight: 600;
}

.user-level.level-beginner {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
}

.user-level.level-intermediate {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
}

.user-level.level-advanced {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
}

.user-score {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #818cf8;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.user-score i {
  font-size: 0.9rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(129, 140, 248, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-icon i {
  font-size: 3rem;
  color: #818cf8;
  opacity: 0.6;
}

.empty-state h4 {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Certificates Grid */
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.certificate-card {
  background: rgba(129, 140, 248, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.15);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
}

.certificate-card:hover {
  background: rgba(129, 140, 248, 0.1);
  border-color: rgba(129, 140, 248, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(129, 140, 248, 0.2);
}

.cert-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.cert-content {
  flex: 1;
  min-width: 0;
}

.cert-title {
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.375rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cert-date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

.cert-download {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cert-download:hover {
  background: rgba(129, 140, 248, 0.25);
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 1200px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .hero-right {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .avatar-circle {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }
  
  .hero-stats {
    width: 100%;
    flex-direction: column;
  }
  
  .stat-card {
    width: 100%;
  }
  
  .btn-continue {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .certificates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
