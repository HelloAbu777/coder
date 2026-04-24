<template>
  <div class="chat-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div>
            <h1 class="page-title">
              <i class="bi bi-chat-dots-fill me-2"></i>
              Chat
            </h1>
            <p class="page-subtitle">Mentorlar va o'quvchilar bilan muloqot qiling</p>
          </div>
          <div class="header-stats">
            <div class="stat-item">
              <i class="bi bi-people-fill me-2"></i>
              <span>{{ mentors.length }} mentor</span>
            </div>
            <div class="stat-item" v-if="activeRoom">
              <div class="status-indicator online"></div>
              <span>Faol</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-4">
      <div class="row g-4">
        <!-- Sidebar -->
        <div class="col-lg-3">
          <div class="sidebar-card">
            <!-- Rooms Section -->
            <div class="sidebar-section">
              <div class="section-header">
                <h6>Xonalar</h6>
                <span class="room-count">{{ 1 + mentors.length }}</span>
              </div>
              
              <div class="rooms-list">
                <!-- General Chat -->
                <div class="room-item" 
                  :class="{ active: activeRoom === 'general' }" 
                  @click="setRoom('general', null)">
                  <div class="room-icon general">
                    <i class="bi bi-people-fill"></i>
                  </div>
                  <div class="room-info">
                    <div class="room-name">Umumiy chat</div>
                    <div class="room-meta">Barcha o'quvchilar</div>
                  </div>
                  <div class="room-badge" v-if="activeRoom === 'general'">
                    <i class="bi bi-check-lg"></i>
                  </div>
                </div>

                <!-- Mentors -->
                <div v-for="mentor in mentors" :key="mentor._id"
                  class="room-item" 
                  :class="{ active: activeRoom === `private-${mentor._id}` }"
                  @click="setRoom(`private-${mentor._id}`, mentor)">
                  <div class="room-icon mentor">
                    {{ mentor.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="room-info">
                    <div class="room-name">{{ mentor.name }}</div>
                    <div class="room-meta">
                      <span class="mentor-badge">
                        <i class="bi bi-patch-check-fill me-1"></i>Mentor
                      </span>
                    </div>
                  </div>
                  <div class="room-badge" v-if="activeRoom === `private-${mentor._id}`">
                    <i class="bi bi-check-lg"></i>
                  </div>
                </div>

                <!-- Found User -->
                <div v-if="foundUser && !mentors.find(m => m._id === foundUser._id)"
                  class="room-item found" 
                  :class="{ active: activeRoom === `private-${foundUser._id}` }"
                  @click="setRoom(`private-${foundUser._id}`, foundUser)">
                  <div class="room-icon user">
                    {{ foundUser.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="room-info">
                    <div class="room-name">{{ foundUser.name }}</div>
                    <div class="room-meta">
                      <span class="user-badge">Foydalanuvchi</span>
                    </div>
                  </div>
                  <div class="room-badge" v-if="activeRoom === `private-${foundUser._id}`">
                    <i class="bi bi-check-lg"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search Section -->
            <div class="sidebar-section search-section">
              <div class="section-header">
                <h6>Qidirish</h6>
                <i class="bi bi-search"></i>
              </div>
              
              <div class="search-box">
                <div class="search-input-wrapper">
                  <i class="bi bi-at search-icon"></i>
                  <input
                    v-model="searchEmail"
                    type="text"
                    placeholder="Username kiriting..."
                    @keyup.enter="findUser"
                    class="search-input"
                  />
                </div>
                
                <button class="search-btn" 
                  :disabled="findLoading || !searchEmail.trim()" 
                  @click="findUser">
                  <span v-if="findLoading" class="spinner"></span>
                  <i v-else class="bi bi-search"></i>
                </button>
              </div>

              <div v-if="findError" class="search-error">
                <i class="bi bi-exclamation-circle me-2"></i>
                {{ findError }}
              </div>

              <div v-if="foundUser" class="found-user-card" @click="setRoom(`private-${foundUser._id}`, foundUser)">
                <div class="found-avatar">
                  {{ foundUser.name?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="found-info">
                  <div class="found-name">{{ foundUser.name }}</div>
                  <div class="found-role">
                    <span class="role-badge" :class="`role-${foundUser.role}`">
                      {{ foundUser.role === 'mentor' ? 'Mentor' : foundUser.role === 'admin' ? 'Admin' : 'O\'quvchi' }}
                    </span>
                  </div>
                </div>
                <button class="chat-btn">
                  <i class="bi bi-chat-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="col-lg-9">
          <!-- Empty State -->
          <div v-if="!activeRoom" class="empty-chat">
            <div class="empty-icon">
              <i class="bi bi-chat-square-text"></i>
            </div>
            <h3>Suhbatni boshlang</h3>
            <p>Chap tarafdan xona tanlang yoki username orqali foydalanuvchi qidiring</p>
            <div class="empty-features">
              <div class="feature-item">
                <i class="bi bi-people-fill"></i>
                <span>Umumiy chat</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-person-workspace"></i>
                <span>Shaxsiy xabar</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-shield-check"></i>
                <span>Xavfsiz</span>
              </div>
            </div>
          </div>

          <!-- Chat Box -->
          <div v-else class="chat-container">
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="chat-header-left">
                <div class="chat-avatar" v-if="activeRoomUser">
                  {{ activeRoomUser.name?.charAt(0)?.toUpperCase() }}
                  <div class="avatar-status"></div>
                </div>
                <div class="chat-avatar general-avatar" v-else>
                  <i class="bi bi-people-fill"></i>
                </div>
                <div class="chat-header-info">
                  <h5 class="chat-title">{{ activeRoomUser ? activeRoomUser.name : 'Umumiy chat' }}</h5>
                  <p class="chat-subtitle">
                    <span class="status-dot"></span>
                    {{ activeRoom === 'general' ? 'Barcha o\'quvchilar' : 'Shaxsiy xabar' }}
                  </p>
                </div>
              </div>
              <div class="chat-header-actions">
                <button class="header-action-btn" title="Qidirish">
                  <i class="bi bi-search"></i>
                </button>
                <button class="header-action-btn" title="Ma'lumot">
                  <i class="bi bi-info-circle"></i>
                </button>
              </div>
            </div>

            <!-- Chat Messages -->
            <ChatBox
              :room-id="activeRoom"
              :current-user-id="authStore.user?._id"
              :is-admin="authStore.isAdmin"
            />
          </div>
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
        const { data } = await api.get(`/mentor/find-user?username=${encodeURIComponent(searchEmail.value.toLowerCase())}`);
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
.chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}

/* Header */
.page-header {
  background: rgba(129, 140, 248, 0.05);
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #818cf8;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  background: rgba(129, 140, 248, 0.1);
  border-radius: 8px;
}

.stat-item i {
  color: #818cf8;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Sidebar */
.sidebar-card {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.sidebar-section {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
}

.sidebar-section:last-child {
  border-bottom: none;
}

.search-section {
  background: rgba(129, 140, 248, 0.03);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h6 {
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.room-count {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.section-header i {
  color: #818cf8;
  font-size: 1rem;
}

/* Rooms List */
.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.rooms-list::-webkit-scrollbar {
  width: 4px;
}

.rooms-list::-webkit-scrollbar-track {
  background: rgba(129, 140, 248, 0.05);
  border-radius: 2px;
}

.rooms-list::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.2);
  border-radius: 2px;
}

.room-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  position: relative;
}

.room-item:hover {
  background: rgba(129, 140, 248, 0.08);
  border-color: rgba(129, 140, 248, 0.15);
}

.room-item.active {
  background: rgba(129, 140, 248, 0.15);
  border-color: rgba(129, 140, 248, 0.3);
}

.room-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: #818cf8;
  border-radius: 0 3px 3px 0;
}

.room-item.found {
  border-color: rgba(245, 158, 11, 0.2);
}

.room-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 1rem;
}

.room-icon.general {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
}

.room-icon.general i {
  font-size: 1.25rem;
}

.room-icon.mentor {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
}

.room-icon.user {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
}

.room-info {
  flex: 1;
  min-width: 0;
}

.room-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.room-meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.mentor-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.user-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.room-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(129, 140, 248, 0.2);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

/* Search Box */
.search-box {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  background: rgba(15, 15, 30, 0.8);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 10px;
  padding: 0.75rem 0.875rem 0.75rem 2.25rem;
  color: #fff;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #818cf8;
  background: rgba(15, 15, 30, 1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-btn {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.search-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(129, 140, 248, 0.4);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-error {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.875rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

/* Found User Card */
.found-user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(129, 140, 248, 0.08);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.found-user-card:hover {
  background: rgba(129, 140, 248, 0.15);
  border-color: rgba(129, 140, 248, 0.3);
}

.found-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.found-info {
  flex: 1;
  min-width: 0;
}

.found-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.found-role {
  display: flex;
  gap: 0.5rem;
}

.role-badge {
  font-size: 0.7rem;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-weight: 500;
}

.role-badge.role-mentor {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
}

.role-badge.role-admin {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.role-badge.role-student {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
}

.chat-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-btn:hover {
  background: rgba(129, 140, 248, 0.25);
  transform: scale(1.05);
}

/* Empty Chat */
.empty-chat {
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 2px dashed rgba(129, 140, 248, 0.2);
  border-radius: 20px;
  padding: 5rem 2rem;
  text-align: center;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: rgba(129, 140, 248, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon i {
  font-size: 4rem;
  color: #818cf8;
}

.empty-chat h3 {
  color: #fff;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
}

.empty-chat p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

.empty-features {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(129, 140, 248, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  min-width: 140px;
}

.feature-item i {
  font-size: 2rem;
  color: #818cf8;
}

.feature-item span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Chat Container */
.chat-container {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.1);
  border-radius: 16px;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

/* Chat Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: rgba(129, 140, 248, 0.05);
  border-bottom: 1px solid rgba(129, 140, 248, 0.1);
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
  position: relative;
}

.general-avatar {
  background: rgba(129, 140, 248, 0.2);
  color: #818cf8;
}

.general-avatar i {
  font-size: 1.5rem;
}

.avatar-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid rgba(30, 30, 46, 0.8);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.chat-header-info {
  flex: 1;
}

.chat-title {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
}

.chat-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

.chat-header-actions {
  display: flex;
  gap: 0.5rem;
}

.header-action-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  background: rgba(129, 140, 248, 0.1);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.header-action-btn:hover {
  background: rgba(129, 140, 248, 0.2);
  color: #fff;
}

/* Responsive */
@media (max-width: 991px) {
  .empty-features {
    gap: 1rem;
  }
  
  .feature-item {
    min-width: 120px;
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .empty-chat {
    padding: 3rem 1.5rem;
  }
  
  .empty-features {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .feature-item {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
  }
  
  .chat-header {
    padding: 1rem;
  }
  
  .chat-avatar {
    width: 42px;
    height: 42px;
  }
}
</style>
