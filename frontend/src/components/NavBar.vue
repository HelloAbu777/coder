<template>
  <nav class="navbar">
    <!-- Animated gradient border bottom -->
    <div class="navbar-glow-line"></div>

    <div class="navbar-inner">

      <!-- Logo -->
      <RouterLink class="navbar-brand" to="/dashboard">
        <div class="brand-icon">
          <i class="bi bi-code-slash"></i>
        </div>
        <span class="brand-name">CODERS</span>
      </RouterLink>

      <!-- Divider -->
      <div class="nav-divider"></div>

      <!-- Nav links -->
      <ul class="nav-links">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink :to="link.to" class="nav-link" :class="{ active: isActive(link.to) }">
            <i :class="link.icon"></i>
            <span>{{ link.label }}</span>
            <div class="link-dot" v-if="isActive(link.to)"></div>
          </RouterLink>
        </li>
        <li v-if="authStore.isAdmin">
          <RouterLink to="/admin" class="nav-link nav-link--admin" :class="{ active: isActive('/admin') }">
            <i class="bi bi-shield-check"></i>
            <span>Admin</span>
          </RouterLink>
        </li>
        <li v-if="authStore.isMentor || authStore.isAdmin">
          <RouterLink to="/mentor" class="nav-link nav-link--mentor" :class="{ active: isActive('/mentor') }">
            <i class="bi bi-person-workspace"></i>
            <span>Mentor</span>
          </RouterLink>
        </li>
      </ul>

      <!-- Spacer -->
      <div class="spacer"></div>

      <!-- Right side -->
      <div class="navbar-right">

        <!-- Score -->
        <div class="score-badge">
          <i class="bi bi-star-fill"></i>
          <span>{{ authStore.user?.totalScore || 0 }}</span>
        </div>

        <!-- Notification -->
        <NotificationBell />

        <!-- Separator -->
        <div class="right-sep"></div>

        <!-- User dropdown -->
        <div class="user-menu" ref="menuRef">
          <button class="user-btn" @click="menuOpen = !menuOpen">
            <div class="user-avatar">
              <span>{{ avatarLetter }}</span>
              <div class="avatar-ring"></div>
            </div>
            <div class="user-meta">
              <span class="user-name">{{ authStore.user?.name }}</span>
              <span class="user-level" :class="`lvl-${authStore.user?.level?.toLowerCase()}`">
                {{ authStore.user?.level }}
              </span>
            </div>
            <i class="bi bi-chevron-down chevron" :class="{ rotated: menuOpen }"></i>
          </button>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div class="user-dropdown" v-if="menuOpen">
              <div class="dropdown-header">
                <div class="dh-avatar">{{ avatarLetter }}</div>
                <div class="dh-info">
                  <div class="dh-name">{{ authStore.user?.name }}</div>
                  <div class="dh-user">@{{ authStore.user?.username }}</div>
                </div>
              </div>
              <div class="dropdown-sep"></div>
              <RouterLink :to="`/profile/${authStore.user?.username}`" class="dropdown-item" @click="menuOpen = false">
                <div class="di-icon"><i class="bi bi-person-circle"></i></div>
                <span>Mening profilim</span>
              </RouterLink>
              <RouterLink to="/dashboard" class="dropdown-item" @click="menuOpen = false">
                <div class="di-icon"><i class="bi bi-speedometer2"></i></div>
                <span>Dashboard</span>
              </RouterLink>
              <RouterLink to="/certificates" class="dropdown-item" @click="menuOpen = false">
                <div class="di-icon"><i class="bi bi-award"></i></div>
                <span>Sertifikatlarim</span>
              </RouterLink>
              <div class="dropdown-sep"></div>
              <button class="dropdown-item dropdown-item--logout" @click="logout">
                <div class="di-icon"><i class="bi bi-box-arrow-right"></i></div>
                <span>Chiqish</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Mobile toggle -->
      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen">
        <i :class="mobileOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile">
      <div class="mobile-menu" v-if="mobileOpen">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="mobile-link" :class="{ active: isActive(link.to) }" @click="mobileOpen = false">
          <i :class="link.icon"></i>
          <span>{{ link.label }}</span>
        </RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin" class="mobile-link mobile-link--admin" @click="mobileOpen = false">
          <i class="bi bi-shield-check"></i><span>Admin</span>
        </RouterLink>
        <RouterLink v-if="authStore.isMentor || authStore.isAdmin" to="/mentor" class="mobile-link mobile-link--mentor" @click="mobileOpen = false">
          <i class="bi bi-person-workspace"></i><span>Mentor</span>
        </RouterLink>
      </div>
    </Transition>
  </nav>
</template>

<script>
import NotificationBell from './NotificationBell.vue';
import { useAuthStore } from '../store/auth.js';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'NavBar',
  components: { NotificationBell },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const menuOpen = ref(false);
    const mobileOpen = ref(false);
    const menuRef = ref(null);

    const navLinks = [
      { to: '/dashboard', icon: 'bi bi-speedometer2', label: 'Dashboard' },
      { to: '/videos', icon: 'bi bi-play-circle-fill', label: 'Darslar' },
      { to: '/quiz', icon: 'bi bi-patch-question-fill', label: 'Testlar' },
      { to: '/chat', icon: 'bi bi-chat-dots-fill', label: 'Chat' },
      { to: '/code', icon: 'bi bi-code-slash', label: 'Kod' },
      { to: '/certificates', icon: 'bi bi-award-fill', label: 'Sertifikatlar' }
    ];

    const avatarLetter = computed(() =>
      authStore.user?.name?.charAt(0)?.toUpperCase() || '?'
    );

    const isActive = (path) => route.path.startsWith(path);

    const logout = () => {
      menuOpen.value = false;
      authStore.logout();
      router.push('/');
    };

    const onClickOutside = (e) => {
      if (menuRef.value && !menuRef.value.contains(e.target)) {
        menuOpen.value = false;
      }
    };

    onMounted(() => document.addEventListener('click', onClickOutside));
    onUnmounted(() => document.removeEventListener('click', onClickOutside));

    return { authStore, navLinks, avatarLetter, isActive, logout, menuOpen, mobileOpen, menuRef };
  }
};
</script>

<style scoped>
/* ===== BASE ===== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 200;
  background: linear-gradient(180deg, rgba(9,9,21,0.97) 0%, rgba(13,13,28,0.95) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 1px 0 rgba(99,102,241,0.15), 0 8px 40px rgba(0,0,0,0.5);
}

.navbar-glow-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(99,102,241,0.0) 10%,
    rgba(99,102,241,0.6) 30%,
    rgba(168,85,247,0.8) 50%,
    rgba(99,102,241,0.6) 70%,
    rgba(99,102,241,0.0) 90%,
    transparent 100%
  );
}

.navbar-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 66px;
  display: flex;
  align-items: center;
  gap: 0;
}

/* ===== BRAND ===== */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 0.5rem;
}

.brand-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #fff;
  box-shadow: 0 0 18px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Vertical divider */
.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(99,102,241,0.15);
  margin: 0 1.5rem;
  flex-shrink: 0;
}

/* ===== NAV LINKS ===== */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0.48rem 0.82rem;
  border-radius: 9px;
  text-decoration: none;
  color: #4b5675;
  font-size: 0.84rem;
  font-weight: 500;
  transition: all 0.17s ease;
  white-space: nowrap;
}

.nav-link i {
  font-size: 0.88rem;
  transition: transform 0.17s;
}

.nav-link:hover {
  color: #a5b4fc;
  background: rgba(99,102,241,0.08);
}

.nav-link:hover i {
  transform: translateY(-1px);
}

.nav-link.active {
  color: #c7d2fe;
  background: rgba(99,102,241,0.13);
  font-weight: 600;
}

.nav-link.active i {
  color: #818cf8;
}

/* Active dot indicator */
.link-dot {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #818cf8;
  box-shadow: 0 0 6px rgba(129,140,248,0.8);
}

.nav-link--admin { color: #d97706; }
.nav-link--admin:hover, .nav-link--admin.active {
  color: #fbbf24;
  background: rgba(245,158,11,0.1);
}

.nav-link--mentor { color: #059669; }
.nav-link--mentor:hover, .nav-link--mentor.active {
  color: #34d399;
  background: rgba(16,185,129,0.08);
}

/* ===== SPACER ===== */
.spacer { flex: 1; }

/* ===== RIGHT SECTION ===== */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Score badge */
.score-badge {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  background: rgba(250,204,21,0.07);
  border: 1px solid rgba(250,204,21,0.16);
  border-radius: 22px;
  padding: 0.32rem 0.85rem;
  transition: all 0.2s;
}
.score-badge:hover {
  background: rgba(250,204,21,0.12);
  border-color: rgba(250,204,21,0.28);
}
.score-badge i { color: #facc15; font-size: 0.72rem; }
.score-badge span { font-size: 0.8rem; font-weight: 700; color: #fef08a; }

/* Right separator */
.right-sep {
  width: 1px;
  height: 24px;
  background: rgba(99,102,241,0.14);
  margin: 0 0.3rem;
}

/* ===== USER BUTTON ===== */
.user-menu { position: relative; }

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(15,15,35,0.6);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 12px;
  padding: 0.32rem 0.75rem 0.32rem 0.35rem;
  cursor: pointer;
  transition: all 0.2s;
}
.user-btn:hover {
  background: rgba(99,102,241,0.1);
  border-color: rgba(99,102,241,0.38);
  box-shadow: 0 0 20px rgba(99,102,241,0.12);
}

.user-avatar {
  position: relative;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}
.user-avatar span {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: linear-gradient(135deg, #4338ca, #7c3aed);
  font-size: 0.9rem;
  font-weight: 800;
  color: #fff;
  z-index: 1;
}
.avatar-ring {
  position: absolute;
  inset: -2px;
  border-radius: 11px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  opacity: 0.5;
  z-index: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
.user-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
}
.user-level {
  font-size: 0.63rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 4px;
  letter-spacing: 0.3px;
  margin-top: 1px;
}
.lvl-beginner  { background: rgba(100,116,139,0.2); color: #94a3b8; }
.lvl-elementary { background: rgba(34,197,94,0.12); color: #4ade80; }
.lvl-intermediate { background: rgba(59,130,246,0.12); color: #60a5fa; }
.lvl-advanced  { background: rgba(168,85,247,0.12); color: #c084fc; }
.lvl-pro       { background: rgba(250,204,21,0.12); color: #fde047; }

.chevron {
  font-size: 0.6rem;
  color: #475569;
  transition: transform 0.22s;
  margin-left: 2px;
}
.chevron.rotated { transform: rotate(180deg); }

/* ===== DROPDOWN ===== */
.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 232px;
  background: rgba(10,10,24,0.98);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.05), 0 0 40px rgba(99,102,241,0.06);
  padding: 0.6rem;
  backdrop-filter: blur(20px);
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.55rem 0.7rem;
}
.dh-avatar {
  width: 42px; height: 42px;
  border-radius: 11px;
  background: linear-gradient(135deg, #4338ca, #7c3aed);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; font-weight: 800; color: #fff;
  box-shadow: 0 0 16px rgba(99,102,241,0.35);
  flex-shrink: 0;
}
.dh-name { font-size: 0.9rem; font-weight: 700; color: #f1f5f9; }
.dh-user { font-size: 0.72rem; color: #475569; margin-top: 1px; }

.dropdown-sep { height: 1px; background: rgba(99,102,241,0.1); margin: 0.2rem 0; }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.52rem 0.65rem;
  border-radius: 9px;
  font-size: 0.84rem;
  color: #7c8ca8;
  text-decoration: none;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.15s;
}
.dropdown-item:hover { background: rgba(99,102,241,0.1); color: #c7d2fe; }
.dropdown-item:hover .di-icon { color: #818cf8; }

.di-icon {
  width: 28px; height: 28px;
  border-radius: 7px;
  background: rgba(99,102,241,0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem;
  color: #4b5675;
  transition: all 0.15s;
  flex-shrink: 0;
}

.dropdown-item--logout { color: #f87171; }
.dropdown-item--logout .di-icon { background: rgba(239,68,68,0.08); color: #f87171; }
.dropdown-item--logout:hover { background: rgba(239,68,68,0.08); color: #fca5a5; }

/* ===== DROPDOWN TRANSITION ===== */
.dropdown-enter-active { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.97); }
.dropdown-leave-to   { opacity: 0; transform: translateY(-4px) scale(0.98); }

/* ===== MOBILE ===== */
.mobile-toggle {
  display: none;
  background: rgba(99,102,241,0.08);
  border: 1px solid rgba(99,102,241,0.18);
  border-radius: 9px;
  color: #94a3b8;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0.42rem 0.55rem;
  margin-left: 1rem;
  transition: all 0.15s;
}
.mobile-toggle:hover { background: rgba(99,102,241,0.15); color: #c7d2fe; }

.mobile-menu {
  background: rgba(9,9,21,0.98);
  border-top: 1px solid rgba(99,102,241,0.12);
  padding: 0.75rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  color: #4b5675;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.15s;
}
.mobile-link:hover, .mobile-link.active {
  background: rgba(99,102,241,0.1);
  color: #a5b4fc;
}
.mobile-link--admin { color: #d97706; }
.mobile-link--admin:hover { background: rgba(245,158,11,0.08); color: #fbbf24; }
.mobile-link--mentor { color: #059669; }
.mobile-link--mentor:hover { background: rgba(16,185,129,0.08); color: #34d399; }

.mobile-enter-active { transition: all 0.2s ease; }
.mobile-leave-active { transition: all 0.15s ease; }
.mobile-enter-from { opacity: 0; transform: translateY(-8px); }
.mobile-leave-to   { opacity: 0; transform: translateY(-4px); }

@media (max-width: 1100px) {
  .nav-links { display: none; }
  .nav-divider { display: none; }
  .mobile-toggle { display: flex; }
  .score-badge { display: none; }
}

@media (max-width: 640px) {
  .user-meta { display: none; }
  .chevron { display: none; }
  .right-sep { display: none; }
  .navbar-inner { padding: 0 1rem; }
}
</style>
