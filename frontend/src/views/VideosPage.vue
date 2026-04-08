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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue';
import { useAuthStore } from '../store/auth.js';
import api from '../utils/axios.js';

export default {
  name: 'VideosPage',
  components: { VideoPlayer },
  setup() {
    const authStore = useAuthStore();
    const videos = ref([]);
    const selectedVideo = ref(null);
    const activeSection = ref('HTML');
    const sectionList = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'];

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

    const onWatched = async (videoId) => {
      try {
        await api.post('/videos/watched', { videoId });
        await authStore.fetchMe();
      } catch (_) {}
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

    return { videos, selectedVideo, activeSection, sectionList, filteredVideos, isWatched, isLocked, selectVideo, onWatched, formatDuration };
  }
};
</script>
