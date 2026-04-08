<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top" style="background:var(--bg-card);border-bottom:1px solid var(--border)">
    <div class="container">
      <RouterLink class="navbar-brand" to="/dashboard">CODERS</RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/dashboard">
              <i class="bi bi-speedometer2 me-1"></i>Dashboard
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/videos">
              <i class="bi bi-play-circle me-1"></i>Darslar
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/quiz">
              <i class="bi bi-patch-question me-1"></i>Testlar
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/chat">
              <i class="bi bi-chat-dots me-1"></i>Chat
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/code">
              <i class="bi bi-code-slash me-1"></i>Kod
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/certificates">
              <i class="bi bi-award me-1"></i>Sertifikatlar
            </RouterLink>
          </li>
          <li v-if="authStore.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/admin">
              <i class="bi bi-gear me-1"></i>Admin
            </RouterLink>
          </li>
          <li v-if="authStore.isMentor || authStore.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/mentor">
              <i class="bi bi-person-workspace me-1"></i>Mentor
            </RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <NotificationBell />
          <div class="dropdown">
            <button class="btn btn-sm d-flex align-items-center gap-2" style="color:var(--text-light)" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle fs-5"></i>
              <span>{{ authStore.user?.name }}</span>
              <span class="badge rounded-pill" :class="`badge-${authStore.user?.level?.toLowerCase()}`">
                {{ authStore.user?.level }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" style="background:var(--bg-card);border-color:var(--border)">
              <li>
                <RouterLink :to="`/profile/${authStore.user?.name}`" class="dropdown-item" style="color:var(--text-light)">
                  <i class="bi bi-person me-2"></i>Profil
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" style="border-color:var(--border)"></li>
              <li>
                <button class="dropdown-item" style="color:#ef4444" @click="logout">
                  <i class="bi bi-box-arrow-right me-2"></i>Chiqish
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import NotificationBell from './NotificationBell.vue';
import { useAuthStore } from '../store/auth.js';
import { useRouter } from 'vue-router';

export default {
  name: 'NavBar',
  components: { NotificationBell },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    return { authStore, logout };
  }
};
</script>
