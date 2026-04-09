<template>
  <div class="container py-5">
    <h2 class="section-title mb-5">Video Darslar</h2>

    <!-- Bo'limlar tab -->
    <div class="d-flex gap-2 flex-wrap mb-4">
      <button
        v-for="s in sectionList" :key="s"
        class="btn btn-sm"
        :class="activeSection === s ? 'btn-primary' : 'btn-outline-secondary'"
        @click="activeSection = s">
        {{ s }}
      </button>
    </div>

    <div class="row g-4">
      <!-- Video ro'yxati -->
      <div class="col-lg-4">
        <div class="card-dark p-3" style="max-height:600px;overflow-y:auto">
          <div v-if="filteredVideos.length === 0" class="text-center py-4" style="color:var(--text-muted)">
            <i class="bi bi-play-circle fs-2 d-block mb-2"></i>Darslar yuklanmoqda...
          </div>
          <div
            v-for="(video, index) in filteredVideos" :key="video._id"
            class="d-flex gap-3 p-2 rounded mb-2 cursor-pointer"
            :style="selectedVideo?._id === video._id ? 'background:rgba(79,70,229,0.15)' : 'background:transparent'"
            style="cursor:pointer;transition:background 0.2s"
            @click="selectVideo(video, index)">
            <div class="d-flex align-items-center justify-content-center rounded flex-shrink-0"
              style="width:40px;height:40px;background:var(--bg-card2)">
              <i v-if="isWatched(video._id)" class="bi bi-check-circle-fill" style="color:var(--success)"></i>
              <i v-else-if="isLocked(index)" class="bi bi-lock-fill" style="color:var(--text-muted)"></i>
              <span v-else class="small fw-bold" style="color:var(--primary)">{{ index + 1 }}</span>
            </div>
            <div class="overflow-hidden">
              <div class="small fw-semibold text-truncate" style="color:var(--text-light)">{{ video.title }}</div>
              <div class="small" style="color:var(--text-muted)">{{ formatDuration(video.duration) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video player -->
      <div class="col-lg-8">
        <div v-if="!selectedVideo" class="card-dark d-flex align-items-center justify-content-center" style="height:400px">
          <div class="text-center" style="color:var(--text-muted)">
            <i class="bi bi-play-circle fs-1 d-block mb-3"></i>
            <p>Chapdan video tanlang</p>
          </div>
        </div>
        <div v-else>
          <VideoPlayer
            :url="selectedVideo.url"
            :video-id="selectedVideo._id"
            :duration="selectedVideo.duration"
            @watched="onWatched"
          />
          <div class="card-dark p-4 mt-3">
            <h5 class="fw-semibold mb-2" style="color:var(--text-light)">{{ selectedVideo.title }}</h5>
            <p class="small mb-3" style="color:var(--text-muted)">{{ selectedVideo.description }}</p>
            <div class="d-flex gap-2 flex-wrap">
              <span class="badge" style="background:rgba(79,70,229,0.2);color:#a5b4fc">{{ selectedVideo.section }}</span>
              <RouterLink v-if="isWatched(selectedVideo._id)" :to="`/quiz?videoId=${selectedVideo._id}`" class="btn btn-sm btn-primary">
                <i class="bi bi-patch-question me-1"></i>Testni yech
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== QUIZ UNLOCK MODAL ===== -->
    <transition name="modal-fade">
      <div v-if="showQuizModal" class="quiz-unlock-overlay" @click.self="showQuizModal = false">
        <div class="quiz-unlock-card">
          <div class="qum-icon">
            <i class="bi bi-unlock-fill"></i>
          </div>
          <h4 class="qum-title">Test ochildi!</h4>
          <p class="qum-desc">
            Videoni ko'rib bo'ldingiz.<br>
            Endi testni yechib ball to'plang.
          </p>
          <div class="qum-rules">
            <div class="qum-rule"><i class="bi bi-circle-fill me-2" style="color:#4f46e5;font-size:0.5rem"></i>0 xato — 10 ball</div>
            <div class="qum-rule"><i class="bi bi-circle-fill me-2" style="color:#4f46e5;font-size:0.5rem"></i>1 xato — 9 ball</div>
            <div class="qum-rule"><i class="bi bi-circle-fill me-2" style="color:#4f46e5;font-size:0.5rem"></i>2 xato — 8 ball</div>
            <div class="qum-rule" style="color:#ef4444"><i class="bi bi-circle-fill me-2" style="color:#ef4444;font-size:0.5rem"></i>3+ xato — 0 ball</div>
          </div>
          <div class="qum-actions">
            <button class="btn-start-quiz" @click="goToQuiz">
              <i class="bi bi-play-fill me-2"></i>Testni boshlash
            </button>
            <button class="btn-later" @click="showQuizModal = false">
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

    const filteredVideos = computed(() =>
      videos.value.filter((v) => v.section === activeSection.value)
    );

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

    return { videos, selectedVideo, activeSection, sectionList, filteredVideos, isWatched, isLocked, selectVideo, onWatched, formatDuration, showQuizModal, goToQuiz };
  }
};
</script>

<style scoped>
/* ===== QUIZ UNLOCK MODAL ===== */
.quiz-unlock-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.quiz-unlock-card {
  background: var(--bg-card);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 60px rgba(79, 70, 229, 0.25);
}

.qum-icon {
  width: 72px;
  height: 72px;
  background: rgba(79, 70, 229, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #818cf8;
  margin: 0 auto 1.25rem;
  animation: pulse-glow 1.5s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.3); }
  50% { box-shadow: 0 0 0 12px rgba(79, 70, 229, 0); }
}

.qum-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 0.6rem;
}

.qum-desc {
  color: #94a3b8;
  font-size: 0.92rem;
  margin-bottom: 1.25rem;
  line-height: 1.6;
}

.qum-rules {
  background: rgba(15, 15, 30, 0.5);
  border: 1px solid rgba(79, 70, 229, 0.1);
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.qum-rule {
  font-size: 0.85rem;
  color: #94a3b8;
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
}

.qum-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.btn-start-quiz {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  border-radius: 12px;
  color: #fff;
  padding: 0.8rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-start-quiz:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-later {
  background: transparent;
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 12px;
  color: #64748b;
  padding: 0.65rem;
  font-size: 0.88rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-later:hover { border-color: rgba(79, 70, 229, 0.4); color: #94a3b8; }

/* Transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
