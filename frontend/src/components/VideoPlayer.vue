<template>
  <div class="position-relative">
    <div v-if="blocked" class="d-flex flex-column align-items-center justify-content-center rounded" style="height:360px;background:var(--bg-card2);border:1px solid var(--border)">
      <i class="bi bi-lock-fill fs-1 mb-3" style="color:var(--warning)"></i>
      <p class="fw-semibold mb-1" style="color:var(--text-light)">Video vaqtincha bloklangan</p>
      <p class="small" style="color:var(--text-muted)">{{ blockTimeLeft }} daqiqadan so'ng ochiladi</p>
    </div>
    <div v-else>
      <iframe
        v-if="isYoutube"
        :src="embedUrl"
        class="w-100 rounded"
        style="height:360px;border:none"
        allowfullscreen
        @load="onLoad"
      ></iframe>
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
      <div v-if="watchPercent < 90 && !isYoutube" class="mt-2">
        <ProgressBar :value="watchPercent" label="Ko'rilgan" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ProgressBar from './ProgressBar.vue';

export default {
  name: 'VideoPlayer',
  components: { ProgressBar },
  props: {
    url: { type: String, required: true },
    videoId: { type: String, required: true },
    blockedUntil: { type: String, default: null }
  },
  emits: ['watched'],
  setup(props, { emit }) {
    const videoRef = ref(null);
    const watchPercent = ref(0);

    const blocked = computed(() => {
      if (!props.blockedUntil) return false;
      return new Date(props.blockedUntil) > new Date();
    });

    const blockTimeLeft = computed(() => {
      if (!props.blockedUntil) return 0;
      const diff = new Date(props.blockedUntil) - new Date();
      return Math.max(0, Math.ceil(diff / 60000));
    });

    const isYoutube = computed(() => props.url.includes('youtube.com') || props.url.includes('youtu.be'));

    const embedUrl = computed(() => {
      if (!isYoutube.value) return '';
      const id = props.url.includes('v=')
        ? props.url.split('v=')[1].split('&')[0]
        : props.url.split('/').pop();
      return `https://www.youtube.com/embed/${id}`;
    });

    const onTimeUpdate = () => {
      if (!videoRef.value) return;
      const pct = Math.round((videoRef.value.currentTime / videoRef.value.duration) * 100);
      watchPercent.value = pct;
    };

    const onEnded = () => {
      watchPercent.value = 100;
      emit('watched', props.videoId);
    };

    const onLoad = () => {};

    return { videoRef, watchPercent, blocked, blockTimeLeft, isYoutube, embedUrl, onTimeUpdate, onEnded, onLoad };
  }
};
</script>
