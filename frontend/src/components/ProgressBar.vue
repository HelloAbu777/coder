<template>
  <div>
    <div v-if="label" class="d-flex justify-content-between mb-1">
      <span class="small" style="color:var(--text-muted)">{{ label }}</span>
      <span class="small fw-semibold" style="color:var(--primary)">{{ value }}%</span>
    </div>
    <div class="progress">
      <div class="progress-bar" :style="`width:${value}%`" role="progressbar"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    value: { type: Number, default: 0 },
    label: { type: String, default: '' }
  }
};
</script>
