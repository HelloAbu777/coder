<template>
  <article class="card-dark p-3 h-100">
    <img v-if="img" :src="img" :alt="heading" class="rounded mb-3 w-100" style="height:160px;object-fit:cover" />
    <h5 v-if="heading" class="fw-semibold mb-2" style="color:var(--text-light)">{{ heading }}</h5>
    <p v-if="text" class="small mb-3" style="color:var(--text-muted)">{{ text }}</p>
    <button v-if="button" class="btn btn-primary btn-sm w-100" @click="$emit('action')">{{ button }}</button>
  </article>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    img: String,
    heading: String,
    text: String,
    button: String
  },
  emits: ['action']
};
</script>
