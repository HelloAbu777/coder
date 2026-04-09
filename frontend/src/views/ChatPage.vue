<template>
  <div class="container py-5">
    <h2 class="section-title mb-4">Chat</h2>
    <div class="row g-4">
      <!-- Chap — xona tanlash -->
      <div class="col-md-3">
        <div class="card-dark p-3">
          <p class="small fw-semibold mb-3" style="color:var(--text-muted)">Xonalar</p>
          <div class="d-flex flex-column gap-2">
            <button class="room-btn" :class="{ active: activeRoom === 'general' }" @click="setRoom('general', null)">
              <i class="bi bi-people me-2"></i> Umumiy chat
            </button>
            <button v-for="mentor in mentors" :key="mentor._id"
              class="room-btn" :class="{ active: activeRoom === `private-${mentor._id}` }"
              @click="setRoom(`private-${mentor._id}`, mentor)">
              <i class="bi bi-person-workspace me-2"></i>
              {{ mentor.name }}
              <span class="mentor-label">Mentor</span>
            </button>

            <!-- Topilgan foydalanuvchi -->
            <button v-if="foundUser && !mentors.find(m => m._id === foundUser._id)"
              class="room-btn found-user"
              :class="{ active: activeRoom === `private-${foundUser._id}` }"
              @click="setRoom(`private-${foundUser._id}`, foundUser)">
              <i class="bi bi-person me-2"></i>
              {{ foundUser.name }}
              <span class="found-label">Topildi</span>
            </button>
          </div>

          <!-- Email orqali topish -->
          <div class="find-user-box mt-4">
            <p class="small fw-semibold mb-2" style="color:var(--text-muted)">
              <i class="bi bi-search me-1"></i>Email orqali topish
            </p>
            <div class="find-input-wrap">
              <input
                v-model="searchEmail"
                type="email"
                placeholder="email@example.com"
                @keyup.enter="findUser"
              />
            </div>
            <button class="find-btn" :disabled="findLoading || !searchEmail.trim()" @click="findUser">
              <span v-if="findLoading" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-search me-1"></i>
              Topish
            </button>
            <div v-if="findError" class="find-error">{{ findError }}</div>
            <div v-if="foundUser" class="found-card" @click="setRoom(`private-${foundUser._id}`, foundUser)">
              <div class="found-avatar">{{ foundUser.name?.charAt(0)?.toUpperCase() }}</div>
              <div>
                <div class="found-name">{{ foundUser.name }}</div>
                <div class="found-meta">
                  <span class="badge" :class="`badge-${foundUser.role}`" style="font-size:0.62rem">{{ foundUser.role }}</span>
                </div>
              </div>
              <i class="bi bi-chat-dots ms-auto" style="color:var(--primary)"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- O'ng — chat -->
      <div class="col-md-9">
        <div v-if="!activeRoom" class="card-dark d-flex align-items-center justify-content-center" style="height:520px">
          <div class="text-center" style="color:var(--text-muted)">
            <i class="bi bi-chat-square-dots fs-1 d-block mb-3"></i>
            <p>Chat tanlang yoki email orqali foydalanuvchi toping</p>
          </div>
        </div>
        <div v-else>
          <!-- Chat header -->
          <div class="chat-room-header mb-2">
            <div class="crh-avatar" v-if="activeRoomUser">
              {{ activeRoomUser.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="crh-avatar general" v-else><i class="bi bi-people-fill"></i></div>
            <div>
              <div class="crh-name">{{ activeRoomUser ? activeRoomUser.name : 'Umumiy chat' }}</div>
              <div class="crh-sub">{{ activeRoom === 'general' ? 'Barcha o\'quvchilar' : 'Shaxsiy xabar' }}</div>
            </div>
          </div>
          <ChatBox
            :room-id="activeRoom"
            :current-user-id="authStore.user?._id"
            :is-admin="authStore.isAdmin"
          />
        </div>
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
    const activeRoomUser = ref(null);
    const mentors = ref([]);
    const searchEmail = ref('');
    const foundUser = ref(null);
    const findLoading = ref(false);
    const findError = ref('');

    const setRoom = (roomId, user) => {
      activeRoom.value = roomId;
      activeRoomUser.value = user;
    };

    const findUser = async () => {
      if (!searchEmail.value.trim()) return;
      findError.value = '';
      foundUser.value = null;
      findLoading.value = true;
      try {
        const { data } = await api.get(`/mentor/find-user?email=${encodeURIComponent(searchEmail.value)}`);
        foundUser.value = data;
        setRoom(`private-${data._id}`, data);
      } catch (err) {
        findError.value = err.response?.data?.message || 'Foydalanuvchi topilmadi';
      } finally {
        findLoading.value = false;
      }
    };

    onMounted(async () => {
      try {
        const { data } = await api.get('/mentor/students');
        mentors.value = data.filter((u) => u.role === 'mentor');
      } catch (_) {}
    });

    return { authStore, activeRoom, activeRoomUser, mentors, searchEmail, foundUser, findLoading, findError, setRoom, findUser };
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
.room-btn.found-user { border-color: rgba(16,185,129,0.2); }
.mentor-label { margin-left: auto; font-size: 0.7rem; background: rgba(16,185,129,0.15); color: #6ee7b7; padding: 1px 6px; border-radius: 10px; }
.found-label { margin-left: auto; font-size: 0.7rem; background: rgba(245,158,11,0.15); color: #fcd34d; padding: 1px 6px; border-radius: 10px; }

/* Find user */
.find-user-box { border-top: 1px solid var(--border); padding-top: 1rem; }

.find-input-wrap { margin-bottom: 0.5rem; }
.find-input-wrap input {
  width: 100%;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: var(--text-light);
  font-size: 0.82rem;
  outline: none;
  transition: border-color 0.2s;
}
.find-input-wrap input:focus { border-color: rgba(79,70,229,0.5); }
.find-input-wrap input::placeholder { color: var(--text-muted); }

.find-btn {
  width: 100%;
  background: rgba(79,70,229,0.12);
  border: 1px solid rgba(79,70,229,0.25);
  color: #818cf8;
  padding: 0.45rem;
  border-radius: 8px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.find-btn:hover:not(:disabled) { background: rgba(79,70,229,0.2); }
.find-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.find-error { font-size: 0.78rem; color: #fca5a5; margin-top: 0.4rem; text-align: center; }

.found-card {
  display: flex; align-items: center; gap: 0.6rem;
  margin-top: 0.6rem;
  padding: 0.6rem 0.75rem;
  background: rgba(79,70,229,0.08);
  border: 1px solid rgba(79,70,229,0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.found-card:hover { background: rgba(79,70,229,0.15); }

.found-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
}
.found-name { font-size: 0.85rem; font-weight: 600; color: var(--text-light); }
.found-meta { margin-top: 0.1rem; }

/* Chat header */
.chat-room-header {
  display: flex; align-items: center; gap: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.75rem 1rem;
}
.crh-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
}
.crh-avatar.general { background: rgba(79,70,229,0.2); color: #818cf8; }
.crh-name { font-size: 0.95rem; font-weight: 600; color: var(--text-light); }
.crh-sub { font-size: 0.72rem; color: var(--text-muted); }
</style>
