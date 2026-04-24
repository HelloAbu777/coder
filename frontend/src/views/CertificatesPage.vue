<template>
  <div class="certificates-page">
    <!-- Hero Header -->
    <div class="hero-header">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <i class="bi bi-stars"></i>
              <span>Professional Sertifikatlar</span>
            </div>
            <h1 class="hero-title">
              🏆 Sertifikatlar
            </h1>
            <p class="hero-subtitle">Bo'limlarni tugating va professional sertifikat oling</p>
          </div>
          <div class="hero-stats">
            <div class="stat-card">
              <div class="stat-icon trophy">
                <i class="bi bi-trophy-fill"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ certificates.length }}</div>
                <div class="stat-label">Sertifikatlar</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon success">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ completedCount }}</div>
                <div class="stat-label">Tugallangan</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon progress">
                <i class="bi bi-graph-up"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ progressPercent }}%</div>
                <div class="stat-label">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container main-content">
      <!-- Overall Progress -->
      <div class="progress-section">
        <div class="progress-header">
          <div>
            <h3 class="progress-title">Umumiy progress</h3>
            <p class="progress-desc">{{ completedCount }} ta bo'limdan {{ sections.length }} ta tugallandi</p>
          </div>
          <div class="progress-percentage">{{ progressPercent }}%</div>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: `${progressPercent}%` }">
              <div class="progress-bar-glow"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sections Grid -->
      <div class="sections-section">
        <div class="section-title-wrapper">
          <h2 class="section-title">
            <i class="bi bi-grid-fill"></i>
            Bo'limlar holati
          </h2>
          <p class="section-desc">Har bir bo'limni tugating va sertifikat oling</p>
        </div>

        <div class="sections-grid">
          <div 
            v-for="s in sections" 
            :key="s.name" 
            class="section-card" 
            :class="{ 
              'completed': s.completed,
              'has-cert': s.hasCert 
            }">
            <div class="section-bg-pattern"></div>
            
            <div class="section-icon-wrapper">
              <div class="section-icon">{{ s.icon }}</div>
              <div class="section-status-badge" v-if="s.completed">
                <i class="bi bi-check-circle-fill"></i>
              </div>
            </div>
            
            <div class="section-content">
              <h4 class="section-name">{{ s.name }}</h4>
              <div class="section-status">
                <span v-if="s.completed" class="status-completed">
                  <i class="bi bi-check-lg"></i>
                  Tugallangan
                </span>
                <span v-else class="status-pending">
                  <i class="bi bi-clock"></i>
                  Davom etmoqda
                </span>
              </div>
            </div>

            <button 
              v-if="s.completed && !s.hasCert" 
              class="btn-get-cert"
              :disabled="generating === s.name"
              @click="getCertificate(s.name)">
              <span v-if="generating === s.name" class="btn-spinner"></span>
              <i v-else class="bi bi-award"></i>
              <span>{{ generating === s.name ? 'Yaratilmoqda...' : 'Sertifikat olish' }}</span>
            </button>

            <div v-else-if="s.hasCert" class="cert-obtained">
              <i class="bi bi-patch-check-fill"></i>
              <span>Sertifikat olingan</span>
            </div>
          </div>
        </div>
      </div>

      <!-- My Certificates -->
      <div class="certificates-section">
        <div class="section-title-wrapper">
          <h2 class="section-title">
            <i class="bi bi-collection-fill"></i>
            Mening sertifikatlarim
          </h2>
          <p class="section-desc">Sizning professional yutuqlaringiz</p>
        </div>

        <!-- Empty State -->
        <div v-if="certificates.length === 0" class="empty-state">
          <div class="empty-illustration">
            <div class="empty-icon-bg">
              <i class="bi bi-award"></i>
            </div>
          </div>
          <h3 class="empty-title">Hali sertifikat yo'q</h3>
          <p class="empty-text">Bo'limlarni tugating va professional sertifikat oling!</p>
          
          <div class="empty-steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <i class="bi bi-play-circle-fill"></i>
                <span>Darslarni ko'ring</span>
              </div>
            </div>
            <div class="step-arrow">
              <i class="bi bi-arrow-right"></i>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <i class="bi bi-pencil-square"></i>
                <span>Testlarni yeching</span>
              </div>
            </div>
            <div class="step-arrow">
              <i class="bi bi-arrow-right"></i>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <i class="bi bi-trophy-fill"></i>
                <span>Sertifikat oling</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates Grid -->
        <div v-else class="certificates-grid">
          <div v-for="cert in certificates" :key="cert._id" class="certificate-card">
            <!-- Decorative Elements -->
            <div class="cert-decoration">
              <div class="cert-corner tl"></div>
              <div class="cert-corner tr"></div>
              <div class="cert-corner bl"></div>
              <div class="cert-corner br"></div>
            </div>
            <div class="cert-pattern"></div>

            <!-- Certificate Content -->
            <div class="cert-header">
              <div class="cert-logo">
                <i class="bi bi-award-fill"></i>
              </div>
              <div class="cert-brand">CODERS</div>
            </div>

            <div class="cert-body">
              <div class="cert-title">Sertifikat</div>
              <div class="cert-section">{{ cert.section }}</div>
              <div class="cert-subtitle">Bo'limi bo'yicha</div>
              <div class="cert-divider"></div>
            </div>

            <div class="cert-footer">
              <div class="cert-meta">
                <div class="meta-item">
                  <i class="bi bi-calendar3"></i>
                  <span>{{ formatDate(cert.issuedAt) }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-hash"></i>
                  <span>{{ cert.uniqueId?.slice(0, 8) }}</span>
                </div>
              </div>
              
              <a v-if="cert.pdfUrl" :href="cert.pdfUrl" target="_blank" class="btn-download">
                <i class="bi bi-download"></i>
                <span>PDF yuklab olish</span>
              </a>
            </div>

            <div class="cert-seal">
              <i class="bi bi-patch-check-fill"></i>
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

    const completedCount = computed(() => 
      sections.value.filter(s => s.completed).length
    );

    const progressPercent = computed(() => 
      Math.round((completedCount.value / sections.value.length) * 100)
    );

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

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

    return { 
      certificates, 
      sections, 
      generating, 
      getCertificate,
      completedCount,
      progressPercent,
      formatDate
    };
  }
};
</script>

<style scoped>
/* ===== Base Styles ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.certificates-page {
  min-height: 100vh;
  background: #0a0a14;
  padding-bottom: 4rem;
}

/* ===== Hero Header ===== */
.hero-header {
  position: relative;
  padding: 3rem 0 2.5rem;
  background: linear-gradient(180deg, #1a1a2e 0%, #0a0a14 100%);
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-text {
  flex: 1;
  min-width: 300px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 0.4rem 0.9rem;
  border-radius: 50px;
  font-size: 0.8125rem;
  color: #a5b4fc;
  margin-bottom: 1rem;
  font-weight: 500;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1rem;
  color: #94a3b8;
  font-weight: 400;
}

.hero-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 140px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-icon.trophy {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.stat-icon.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.stat-icon.progress {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.625rem;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== Main Content ===== */
.main-content {
  padding-top: 2.5rem;
}

/* ===== Progress Section ===== */
.progress-section {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 2.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.progress-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.progress-desc {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0.25rem 0 0;
}

.progress-percentage {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-bar-wrapper {
  position: relative;
}

.progress-bar-track {
  height: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  border-radius: 10px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent);
  animation: shimmer 2s infinite;
}

/* ===== Section Title ===== */
.section-title-wrapper {
  margin-bottom: 1.75rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.section-title i {
  color: #6366f1;
  font-size: 1.375rem;
}

.section-desc {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

/* ===== Sections Grid ===== */
.sections-section {
  margin-bottom: 3rem;
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.section-card {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.75rem 1.25rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.section-card:hover {
  transform: translateY(-6px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.section-card.completed {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.03);
}

.section-card.completed:hover {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 16px 32px rgba(16, 185, 129, 0.15);
}

.section-bg-pattern {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.section-card:hover .section-bg-pattern {
  opacity: 1;
}

.section-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 3rem;
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.2));
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-card:hover .section-icon {
  transform: scale(1.08);
}

.section-status-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);
}

.section-content {
  margin-bottom: 1.5rem;
}

.section-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.75rem;
}

.section-status {
  font-size: 0.875rem;
}

.status-completed {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #10b981;
  font-weight: 600;
}

.status-pending {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #94a3b8;
}

.btn-get-cert {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-get-cert:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-get-cert:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.cert-obtained {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 10px;
  color: #10b981;
  font-weight: 600;
  font-size: 0.9375rem;
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeIn 0.6s ease-out;
}

.empty-illustration {
  margin-bottom: 2rem;
}

.empty-icon-bg {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #6366f1;
  animation: pulse 2s ease-in-out infinite;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.75rem;
}

.empty-text {
  font-size: 1.0625rem;
  color: #94a3b8;
  margin: 0 0 3rem;
}

.empty-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  max-width: 700px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-content i {
  font-size: 1.5rem;
  color: #6366f1;
}

.step-content span {
  font-size: 0.9375rem;
  color: #f1f5f9;
  font-weight: 500;
}

.step-arrow {
  font-size: 1.5rem;
  color: #94a3b8;
}

/* ===== Certificates Grid ===== */
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.certificate-card {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
  transition: all 0.4s ease;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

.certificate-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 25px 50px rgba(99, 102, 241, 0.3);
}

.cert-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cert-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(251, 191, 36, 0.4);
}

.cert-corner.tl {
  top: 12px;
  left: 12px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 8px;
}

.cert-corner.tr {
  top: 12px;
  right: 12px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 8px;
}

.cert-corner.bl {
  bottom: 12px;
  left: 12px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 8px;
}

.cert-corner.br {
  bottom: 12px;
  right: 12px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 8px;
}

.cert-pattern {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.certificate-card:hover .cert-pattern {
  opacity: 1;
}

.cert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.cert-logo {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
}

.cert-brand {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.cert-body {
  text-align: center;
  margin-bottom: 2rem;
}

.cert-title {
  font-size: 1rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.75rem;
}

.cert-section {
  font-size: 2.25rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
}

.cert-subtitle {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.cert-divider {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #6366f1, transparent);
  margin: 0 auto;
}

.cert-footer {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cert-meta {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.meta-item i {
  color: #6366f1;
}

.btn-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
}

.btn-download:hover {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.cert-seal {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 3rem;
  color: rgba(251, 191, 36, 0.3);
  transition: all 0.3s ease;
}

.certificate-card:hover .cert-seal {
  color: rgba(251, 191, 36, 0.6);
  transform: rotate(15deg) scale(1.1);
}

/* ===== Animations ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-stats {
    width: 100%;
  }

  .stat-card {
    flex: 1;
    min-width: 0;
  }

  .sections-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .certificates-grid {
    grid-template-columns: 1fr;
  }

  .progress-percentage {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .empty-steps {
    flex-direction: column;
    gap: 1rem;
  }

  .step-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 480px) {
  .hero-header {
    padding: 2rem 0 1.5rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .progress-section {
    padding: 1.5rem;
  }

  .certificate-card {
    padding: 1.5rem;
  }

  .cert-section {
    font-size: 1.75rem;
  }
}
</style>
