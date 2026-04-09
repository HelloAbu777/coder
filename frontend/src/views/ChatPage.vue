<template>
  <div class="container py-5">
    <h2 class="section-title mb-4">Chat</h2>
    <div class="row g-4">
      <!-- Chap — xona tanlash -->
      <div class="col-md-3">
        <div class="card-dark p-3">
          <p class="small fw-semibold mb-3" style="color:var(--text-muted)">Xonalar</p>
          <div class="d-flex flex-column gap-2">
            <button class="room-btn" :class="{ active: activeRoom === 'general' }" @click="activeRoom = 'general'">
              <i class="bi bi-people me-2"></i> Umumiy chat
            </button>
            <button v-for="mentor in mentors" :key="mentor._id"
              class="room-btn" :class="{ active: activeRoom === mentor._id }" @click="activeRoom = mentor._id">
              <i class="bi bi-person-workspace me-2"></i>
              {{ mentor.name }}
              <span class="mentor-label">Mentor</span>
            </button>
          </div>
        </div>
      </div>

      <!-- O'ng — chat -->
      <div class="col-md-9">
        <ChatBox :room-id="activeRoom" :current-user-id="authStore.user?._id" :is-admin="authStore.isAdmin" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ChatBox from '../components/ChatBox.vue';
import { useAuthStore } from '../store/auth.js';
import api from '../utils/axios.js';

export default {
  name: 'ChatPage',
  components: { ChatBox },
  setup() {
    const authStore = useAuthStore();
    const activeRoom = ref('general');
    const mentors = ref([]);

    onMounted(async () => {
      try {
        const { data } = await api.get('/mentor/students');
        mentors.value = data.filter((u) => u.role === 'mentor');
      } catch (_) {}
    });

    return { authStore, activeRoom, mentors };
  }
};
</script>

<style scoped>
.room-btn {
  display: flex; align-items: center; width: 100%;
  padding: 0.65rem 0.9rem; background: transparent;
  border: 1px solid transparent; border-radius: 8px;
  color: var(--text-muted); font-size: 0.88rem;
  cursor: pointer; text-align: left; transition: all 0.2s;
}
.room-btn:hover { background: rgba(79,70,229,0.08); color: var(--text-light); }
.room-btn.active { background: rgba(79,70,229,0.15); border-color: rgba(79,70,229,0.3); color: #818cf8; }
.mentor-label { margin-left: auto; font-size: 0.7rem; background: rgba(16,185,129,0.15); color: #6ee7b7; padding: 1px 6px; border-radius: 10px; }
</style>
