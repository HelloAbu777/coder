<template>
  <div id="app">
    <NavBar v-if="showNav" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './store/auth.js';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: { NavBar },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    authStore.init();

    const showNav = computed(() => !['/', '/login', '/register', '/payment', '/admin', '/admin/login', '/mentor'].includes(route.path));

    return { showNav };
  }
};
</script>
