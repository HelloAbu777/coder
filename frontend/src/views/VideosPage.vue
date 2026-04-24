<template>
  <div class="videos-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div>
            <h1 class="page-title">
              <i class="bi bi-play-circle-fill me-2"></i>
              Video Darslar
            </h1>
            <p class="page-subtitle">Dasturlashni video darslar orqali o'rganing</p>
          </div>
          <div class="header-stats">
            <div class="stat-badge">
              <i class="bi bi-collection-play me-2"></i>
              <span>{{ videos.length }} ta dars</span>
            </div>
            <div class="stat-badge">
              <i class="bi bi-check-circle-fill me-2"></i>
              <span>{{ watchedCount }} ta ko'rilgan</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-4">
      <!-- Section Tabs -->
      <div class="section-tabs">
        <button
          v-for="s in sectionList" :key="s"
          class="section-tab"
          :class="{ active: activeSection === s }"
          @click="activeSection = s">
          <span class="tab-icon">{{ getSectionIcon(s) }}</span>
          <span class="tab-text">{{ s }}</span>
          <span class="tab-count">{{ getSectionCount(s) }}</span>
        </button>
      </div>

      <div class="row g-4 mt-2">
        <!-- Video List Sidebar -->
        <div class="col-lg-4">
          <div class="videos-sidebar">
            <div class="sidebar-header">
              <h6>Darslar ro'yxati</h6>
              <div class="progress-indicator">
                <span>{{ watchedInSection }}/{{ filteredVideos.length }}</span>
              </div>
            </div>
            
            <div class="videos-list">
              <div v-if="filteredVideos.length === 0" class="loading-state">
                <div class="spinner"></div>
                <p>Darslar yuklanmoqda...</p>
              </div>
              
              <div
                v-for="(video, index) in filteredVideos" :key="video._id"
                class="video-item"
                :class="{ 
                  active: selectedVideo?._id === video._id,
                  watched: isWatched(video._id),
                  locked: isLocked(index)
                }"
                @click="selectVideo(video, index)">
                
                <div class="video-number">
                  <i v-if="isWatched(video._id)" class="bi bi-check-circle-fill"></i>
                  <i v-else-if="isLocked(index)" class="bi bi-lock-fill"></i>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                
                <div class="video-info">
                  <div class="video-title">{{ video.title }}</div>
                  <div class="video-meta">
                    <span class="video-duration">
                      <i class="bi bi-clock"></i>
                      {{ formatDuration(video.duration) }}
                    </span>
                  </div>
                </div>
                
                <div class="video-status" v-if="isWatched(video._id)">
                  <i class="bi bi-check-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Player Area -->
        <div class="col-lg-8">
          <!-- Empty State -->
          <div v-if="!selectedVideo" class="empty-player">
            <div class="empty-icon">
              <i class="bi bi-play-btn"></i>
            </div>
            <h3>Darsni boshlang</h3>
            <p>Chap tarafdan video tanlang va o'rganishni boshlang</p>
            <div class="empty-features">
              <div class="feature">
                <i class="bi bi-camera-video-fill"></i>
                <span>HD Video</span>
              </div>
              <div class="feature">
                <i class="bi bi-patch-check-fill"></i>
                <span>Testlar</span>
              </div>
              <div class="feature">
                <i class="bi bi-award-fill"></i>
                <span>Sertifikat</span>
              </div>
            </div>
          </div>

          <!-- Video Player -->
          <div v-else class="player-container">
            <div class="player-wrapper">
              <VideoPlayer
                :url="selectedVideo.url"
                :video-id="selectedVideo._id"
                :duration="selectedVideo.duration"
                @watched="onWatched"
              />
            </div>
            
            <div class="video-details">
              <div class="details-header">
                <div class="details-title-section">
                  <h4 class="details-title">{{ selectedVideo.title }}</h4>
                  <div class="details-badges">
                    <span class="section-badge">{{ selectedVideo.section }}</span>
                    <span class="status-badge" v-if="isWatched(selectedVideo._id)">
                      <i class="bi bi-check-circle-fill me-1"></i>
                      Ko'rilgan
                    </span>
                  </div>
                </div>
                <RouterLink 
                  v-if="isWatched(selectedVideo._id)" 
                  :to="`/quiz?videoId=${selectedVideo._id}`" 
                  class="btn-quiz">
                  <i class="bi bi-patch-question-fill me-2"></i>
                  Testni yech
                </RouterLink>
              </div>
              
              <div class="details-description">
                <p>{{ selectedVideo.description }}</p>
              </div>
              
              <div class="details-footer">
                <div class="detail-item">
                  <i class="bi bi-clock-fill"></i>
                  <span>{{ formatDuration(selectedVideo.duration) }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-eye-fill"></i>
                  <span>{{ selectedVideoIndex + 1 }}-dars</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Unlock Modal -->
    <transition name="modal">
      <div v-if="showQuizModal" class="modal-overlay" @click.self="showQuizModal = false">
        <div class="modal-card quiz-modal">
          <div class="modal-icon">
            <i class="bi bi-unlock-fill"></i>
          </div>
          <h3 class="modal-title">Test ochildi!</h3>
          <p class="modal-subtitle">
            Videoni muvaffaqiyatli ko'rib bo'ldingiz.<br>
            Endi testni yechib bilimingizni sinab ko'ring.
          </p>
          
          <div class="scoring-rules">
            <div class="rule-title">Ball tizimi:</div>
            <div class="rule-item success">
              <i class="bi bi-check-circle-fill"></i>
              <span>0 xato — 10 ball</span>
            </div>
            <div class="rule-item success">
              <i class="bi bi-check-circle-fill"></i>
              <span>1 xato — 9 ball</span>
            </div>
            <div class="rule-item warning">
              <i class="bi bi-exclamation-circle-fill"></i>
              <span>2 xato — 8 ball</span>
            </div>
            <div class="rule-item danger">
              <i class="bi bi-x-circle-fill"></i>
              <span>3+ xato — 0 ball</span>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-primary-modal" @click="goToQuiz">
              <i class="bi bi-play-fill me-2"></i>
              Testni boshlash
            </button>
            <button class="btn-secondary-modal" @click="showQuizModal = false">
              Keyinroq
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VideoPlayer from '../components/VideoPlayer.vue';
import { useAuthStore } from '../store/auth.js';
import api from '../utils/axios.js';

export default {
  name: 'VideosPage',
  components: { VideoPlayer },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const videos = ref([]);
    const selectedVideo = ref(null);
    const activeSection = ref('HTML');
    const sectionList = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'];
    const showQuizModal = ref(false);
    const quizVideoId = ref(null);

    const sectionIcons = {
      'HTML': '🌐',
      'CSS': '🎨',
      'JavaScript': '⚡',
      'Node.js': '🖥️',
      'Python': '🐍'
    };

    const filteredVideos = computed(() =>
      videos.value.filter((v) => v.section === activeSection.value)
    );

    const watchedCount = computed(() => 
      authStore.user?.completedVideos?.length || 0
    );

    const watchedInSection = computed(() => 
      filteredVideos.value.filter(v => isWatched(v._id)).length
    );

    const selectedVideoIndex = computed(() => 
      filteredVideos.value.findIndex(v => v._id === selectedVideo.value?._id)
    );

    const getSectionIcon = (section) => sectionIcons[section] || '📚';

    const getSectionCount = (section) => 
      videos.value.filter(v => v.section === section).length;

    const isWatched = (id) => authStore.user?.completedVideos?.includes(id);

    const isLocked = (index) => {
      if (index === 0) return false;
      const prev = filteredVideos.value[index - 1];
      return !isWatched(prev?._id);
    };

    const selectVideo = (video, index) => {
      if (isLocked(index)) return;
      selectedVideo.value = video;
    };

    // @returns {void} — video ko'rilgandan so'ng test modali ochiladi
    const onWatched = async (videoId) => {
      try {
        await api.post('/videos/watched', { videoId });
        await authStore.fetchMe();
        quizVideoId.value = videoId;
        showQuizModal.value = true;
      } catch (_) {}
    };

    // @returns {void} — test sahifasiga o'tish
    const goToQuiz = () => {
      showQuizModal.value = false;
      router.push(`/quiz?videoId=${quizVideoId.value}`);
    };

    const formatDuration = (sec) => {
      if (!sec) return '—';
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${String(s).padStart(2, '0')}`;
    };

    onMounted(async () => {
      try {
        const { data } = await api.get('/videos');
        videos.value = data;
      } catch (_) {}
    });

    return { 
      videos, selectedVideo, activeSection, sectionList, filteredVideos, 
      watchedCount, watchedInSection, selectedVideoIndex,
      getSectionIcon, getSectionCount,
      isWatched, isLocked, selectVideo, onWatched, formatDuration, 
      showQuizModal, goToQuiz 
    };
  }
};
</script>

<style scoped>
.videos-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}

/* Header */
.page-header {
  background: rgba(129, 140, 248, 0.05);
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #818cf8;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(129, 140, 248, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.2);
  padding: 0.625rem 1.125rem;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-badge i {
  color: #818cf8;
}

/* Section Tabs */
.section-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.5rem;
  background: rgba(30, 30, 46, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(129, 140, 248, 0.1);
}

.section-tab {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.section-tab:hover {
  background: rgba(129, 140, 248, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.section-tab.active {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 4px 16px rgba(129, 140, 248, 0.3);
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-text {
  font-weight: 600;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

.section-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.25);
}

/* Videos Sidebar */
.videos-sidebar {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  overflow: hidden;
  height: fit-content;
  max-height: 700px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
  background: rgba(129, 140, 248, 0.03);
}

.sidebar-header h6 {
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
}

.progress-indicator {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.videos-list {
  padding: 0.75rem;
  overflow-y: auto;
  flex: 1;
}

.videos-list::-webkit-scrollbar {
  width: 6px;
}

.videos-list::-webkit-scrollbar-track {
  background: rgba(129, 140, 248, 0.05);
}

.videos-list::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.2);
  border-radius: 3px;
}

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

/* Video Item */
.video-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: rgba(129, 140, 248, 0.03);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.video-item:hover {
  background: rgba(129, 140, 248, 0.08);
  border-color: rgba(129, 140, 248, 0.2);
  transform: translateX(4px);
}

.video-item.active {
  background: rgba(129, 140, 248, 0.15);
  border-color: rgba(129, 140, 248, 0.3);
}

.video-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: #818cf8;
  border-radius: 0 3px 3px 0;
}

.video-item.watched {
  border-color: rgba(16, 185, 129, 0.2);
}

.video-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.video-item.locked:hover {
  transform: none;
}

.video-number {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(129, 140, 248, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: #818cf8;
  flex-shrink: 0;
}

.video-item.watched .video-number {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.video-item.locked .video-number {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
}

.video-number i {
  font-size: 1.25rem;
}

.video-info {
  flex: 1;
  min-width: 0;
}

.video-title {
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.video-duration {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.video-status {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Empty Player */
.empty-player {
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 2px dashed rgba(129, 140, 248, 0.2);
  border-radius: 20px;
  padding: 5rem 2rem;
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: rgba(129, 140, 248, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon i {
  font-size: 4rem;
  color: #818cf8;
}

.empty-player h3 {
  color: #fff;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
}

.empty-player p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

.empty-features {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(129, 140, 248, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  min-width: 120px;
}

.feature i {
  font-size: 2rem;
  color: #818cf8;
}

.feature span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Player Container */
.player-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.player-wrapper {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

/* Video Details */
.video-details {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  padding: 1.75rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.details-title-section {
  flex: 1;
  min-width: 0;
}

.details-title {
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0 0 0.75rem 0;
}

.details-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.section-badge {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.btn-quiz {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(129, 140, 248, 0.3);
  flex-shrink: 0;
}

.btn-quiz:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(129, 140, 248, 0.4);
  color: #fff;
}

.details-description {
  margin-bottom: 1.25rem;
}

.details-description p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.details-footer {
  display: flex;
  gap: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(129, 140, 248, 0.1);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.detail-item i {
  color: #818cf8;
  font-size: 1.1rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-card {
  background: rgba(30, 30, 46, 0.98);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-icon {
  width: 80px;
  height: 80px;
  background: rgba(129, 140, 248, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #818cf8;
  margin: 0 auto 1.5rem;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(129, 140, 248, 0.4);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(129, 140, 248, 0);
  }
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.75rem;
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.scoring-rules {
  background: rgba(15, 15, 30, 0.6);
  border: 1px solid rgba(129, 140, 248, 0.15);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: left;
}

.rule-title {
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0;
  font-size: 0.9rem;
}

.rule-item i {
  font-size: 1.1rem;
}

.rule-item.success {
  color: #6ee7b7;
}

.rule-item.warning {
  color: #fcd34d;
}

.rule-item.danger {
  color: #fca5a5;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary-modal {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(129, 140, 248, 0.4);
}

.btn-primary-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(129, 140, 248, 0.5);
}

.btn-secondary-modal {
  background: transparent;
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.875rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-modal:hover {
  border-color: rgba(129, 140, 248, 0.4);
  color: rgba(255, 255, 255, 0.9);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 991px) {
  .empty-features {
    gap: 1rem;
  }
  
  .feature {
    min-width: 100px;
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .section-tabs {
    flex-direction: column;
  }
  
  .section-tab {
    width: 100%;
    justify-content: space-between;
  }
  
  .empty-player {
    padding: 3rem 1.5rem;
  }
  
  .empty-features {
    flex-direction: column;
    width: 100%;
  }
  
  .feature {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
  }
  
  .details-header {
    flex-direction: column;
  }
  
  .btn-quiz {
    width: 100%;
    justify-content: center;
  }
}
</style>
