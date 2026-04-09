<template>
  <div class="position-relative">
    <div v-if="blocked" class="d-flex flex-column align-items-center justify-content-center rounded" style="height:360px;background:var(--bg-card2);border:1px solid var(--border)">
      <i class="bi bi-lock-fill fs-1 mb-3" style="color:var(--warning)"></i>
      <p class="fw-semibold mb-1" style="color:var(--text-light)">Video vaqtincha bloklangan</p>
      <p class="small" style="color:var(--text-muted)">{{ blockTimeLeft }} daqiqadan so'ng ochiladi</p>
    </div>
    <div v-else>
      <!-- YouTube embed -->
      <iframe
        v-if="isYoutube"
        ref="iframeRef"
        :src="embedUrl"
        class="w-100 rounded"
        style="height:360px;border:none"
        allowfullscreen
        allow="autoplay"
      ></iframe>

      <!-- Mahalliy video -->
      <video
        v-else
        ref="videoRef"
        :src="url"
        class="w-100 rounded"
        style="height:360px;background:#000"
        controls
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
      ></video>

      <!-- YouTube uchun progress va "Ko'rdim" tugmasi -->
      <div v-if="isYoutube" class="yt-controls mt-2">
        <div class="yt-progress-wrap">
          <div class="yt-progress-bar" :style="`width:${ytWatchPercent}%`"></div>
        </div>
        <div class="yt-footer">
          <span class="yt-hint">
            <i class="bi bi-clock me-1"></i>
            <span v-if="ytWatchPercent < 90">Videoni oxirigacha tomosha qiling</span>
            <span v-else style="color:#10b981">Video ko'rildi!</span>
          </span>
          <button
            v-if="ytWatchPercent >= 90 && !ytConfirmed"
            class="btn-watched"
            @click="confirmWatched">
            <i class="bi bi-check2-circle me-2"></i>Ko'rdim — testni boshlash
          </button>
          <span v-if="ytConfirmed" class="watched-badge">
            <i class="bi bi-check-circle-fill me-1"></i>Bajarildi
          </span>
        </div>
      </div>

      <!-- Mahalliy video progress -->
      <div v-if="!isYoutube && watchPercent < 90" class="mt-2">
        <ProgressBar :value="watchPercent" label="Ko'rilgan" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ProgressBar from './ProgressBar.vue';

export default {
  name: 'VideoPlayer',
  components: { ProgressBar },
  props: {
    url: { type: String, required: true },
    videoId: { type: String, required: true },
    blockedUntil: { type: String, default: null },
    duration: { type: Number, default: 0 }
  },
  emits: ['watched'],
  setup(props, { emit }) {
    const videoRef = ref(null);
    const iframeRef = ref(null);
    const watchPercent = ref(0);
    const ytWatchPercent = ref(0);
    const ytConfirmed = ref(false);
    let ytProgressTimer = null;
    let ytElapsed = 0;
    let isPlaying = false;

    const blocked = computed(() => {
      if (!props.blockedUntil) return false;
      return new Date(props.blockedUntil) > new Date();
    });

    const blockTimeLeft = computed(() => {
      if (!props.blockedUntil) return 0;
      const diff = new Date(props.blockedUntil) - new Date();
      return Math.max(0, Math.ceil(diff / 60000));
    });

    const isYoutube = computed(() =>
      props.url.includes('youtube.com') || props.url.includes('youtu.be')
    );

    const embedUrl = computed(() => {
      if (!isYoutube.value) return '';
      let id = '';
      if (props.url.includes('/embed/')) {
        id = props.url.split('/embed/')[1].split('?')[0];
      } else if (props.url.includes('v=')) {
        id = props.url.split('v=')[1].split('&')[0];
      } else {
        id = props.url.split('/').pop();
      }
      return `https://www.youtube.com/embed/${id}?enablejsapi=1`;
    });

    // @returns {void} — YouTube postMessage orqali holat kuzatish
    const onYoutubeMessage = (event) => {
      if (!event.origin.includes('youtube.com')) return;
      try {
        const data = JSON.parse(event.data);
        if (data.event !== 'onStateChange') return;

        const state = data.info;
        if (state === 1) {
          // Ijro boshlandi — timer yoqish
          isPlaying = true;
          clearInterval(ytProgressTimer);
          ytProgressTimer = setInterval(() => {
            if (!isPlaying) return;
            ytElapsed++;
            const totalDur = props.duration > 0 ? props.duration : 600;
            ytWatchPercent.value = Math.min(100, Math.round((ytElapsed / totalDur) * 100));
          }, 1000);
        } else if (state === 2 || state === -1) {
          // To'xtatildi — timer o'chirish
          isPlaying = false;
          clearInterval(ytProgressTimer);
        } else if (state === 0) {
          // Video tugadi
          isPlaying = false;
          clearInterval(ytProgressTimer);
          ytWatchPercent.value = 100;
        }
      } catch (_) {}
    };

    const onTimeUpdate = () => {
      if (!videoRef.value) return;
      const pct = Math.round((videoRef.value.currentTime / videoRef.value.duration) * 100);
      watchPercent.value = pct;
    };

    const onEnded = () => {
      watchPercent.value = 100;
      emit('watched', props.videoId);
    };

    // @returns {void} — foydalanuvchi "Ko'rdim" tugmasini bosdi
    const confirmWatched = () => {
      ytConfirmed.value = true;
      emit('watched', props.videoId);
    };

    onMounted(() => {
      if (isYoutube.value) {
        window.addEventListener('message', onYoutubeMessage);
      }
    });

    onUnmounted(() => {
      if (isYoutube.value) {
        window.removeEventListener('message', onYoutubeMessage);
        clearInterval(ytProgressTimer);
      }
    });

    return {
      videoRef, iframeRef, watchPercent, ytWatchPercent, ytConfirmed,
      blocked, blockTimeLeft, isYoutube, embedUrl,
      onTimeUpdate, onEnded, confirmWatched
    };
  }
};
</script>

<style scoped>
.yt-controls {
  background: rgba(15, 15, 30, 0.8);
  border: 1px solid rgba(79, 70, 229, 0.15);
  border-radius: 10px;
  padding: 0.6rem 1rem;
}

.yt-progress-wrap {
  height: 4px;
  background: rgba(79, 70, 229, 0.12);
  border-radius: 2px;
  margin-bottom: 0.6rem;
  overflow: hidden;
}

.yt-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 2px;
  transition: width 1s ease;
}

.yt-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.yt-hint {
  font-size: 0.8rem;
  color: #64748b;
}

.btn-watched {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.btn-watched:hover { opacity: 0.9; }

.watched-badge {
  font-size: 0.82rem;
  color: #10b981;
  font-weight: 600;
}
</style>
