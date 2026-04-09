<template>
  <div class="mentor-layout">
    <!-- Sidebar -->
    <aside class="mentor-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i class="bi bi-person-workspace"></i>
          <span>Mentor Panel</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems" :key="item.key"
          class="nav-item" :class="{ active: activeTab === item.key }"
          @click="activeTab = item.key">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
          <span v-if="item.key === 'students'" class="nav-badge">{{ students.length }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="mentor-info">
          <div class="mentor-avatar">{{ authStore.user?.name?.charAt(0)?.toUpperCase() }}</div>
          <div>
            <div class="mentor-name">{{ authStore.user?.name }}</div>
            <div class="mentor-role">Mentor</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="mentor-main">
      <!-- O'quvchilar -->
      <div v-if="activeTab === 'students'" class="tab-content">
        <div class="page-header">
          <h2 class="page-title">O'quvchilar</h2>
          <span class="count-badge">{{ students.length }} ta o'quvchi</span>
        </div>

        <div v-if="students.length === 0" class="empty-state">
          <i class="bi bi-people fs-1"></i>
          <p>Hali o'quvchilar yo'q</p>
        </div>

        <div v-else class="students-grid">
          <div
            v-for="s in students" :key="s._id"
            class="student-card"
            @click="openChat(s)">
            <div class="student-avatar">{{ s.name?.charAt(0)?.toUpperCase() }}</div>
            <div class="student-info">
              <div class="student-name">{{ s.name }}</div>
              <div class="student-email">{{ s.email }}</div>
              <div class="student-meta">
                <span class="badge" :class="`badge-${s.level?.toLowerCase()}`">{{ s.level }}</span>
                <span class="score-pill">{{ s.totalScore || 0 }} ball</span>
              </div>
            </div>
            <div class="student-stats">
              <div class="stat-item">
                <div class="stat-val">{{ s.completedVideos?.length || 0 }}</div>
                <div class="stat-lbl">Video</div>
              </div>
              <div class="stat-item">
                <div class="stat-val">{{ s.completedQuizzes?.length || 0 }}</div>
                <div class="stat-lbl">Test</div>
              </div>
              <div class="stat-item">
                <div class="stat-val">{{ s.completedSections?.length || 0 }}</div>
                <div class="stat-lbl">Bo'lim</div>
              </div>
            </div>
            <button class="chat-btn">
              <i class="bi bi-chat-dots me-1"></i>Chat
            </button>
          </div>
        </div>
      </div>

      <!-- Chat -->
      <div v-if="activeTab === 'chat'" class="tab-content">
        <div class="page-header">
          <h2 class="page-title">Chatlar</h2>
        </div>

        <div class="chat-layout">
          <!-- Students list -->
          <div class="chat-sidebar">
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input v-model="searchQuery" type="text" placeholder="Qidirish..." />
            </div>

            <div class="chat-room-item" :class="{ active: selectedRoom === 'general' }" @click="selectRoom('general', null)">
              <div class="room-avatar general"><i class="bi bi-people-fill"></i></div>
              <div class="room-info">
                <div class="room-name">Umumiy chat</div>
                <div class="room-sub">Barcha o'quvchilar</div>
              </div>
            </div>

            <div class="chat-divider">O'quvchilar</div>

            <div
              v-for="s in filteredStudents" :key="s._id"
              class="chat-room-item"
              :class="{ active: selectedRoom === `private-${s._id}` }"
              @click="selectRoom(`private-${s._id}`, s)">
              <div class="room-avatar student">{{ s.name?.charAt(0)?.toUpperCase() }}</div>
              <div class="room-info">
                <div class="room-name">{{ s.name }}</div>
                <div class="room-sub">
                  <span class="badge" :class="`badge-${s.level?.toLowerCase()}`" style="font-size:0.6rem">{{ s.level }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat box -->
          <div class="chat-main">
            <div v-if="!selectedRoom" class="chat-empty">
              <i class="bi bi-chat-square-dots fs-1"></i>
              <p>Chat tanlang</p>
            </div>
            <div v-else class="chat-active">
              <div class="chat-header-bar">
                <div class="chat-header-avatar" v-if="selectedStudent">
                  {{ selectedStudent.name?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="chat-header-avatar general-icon" v-else><i class="bi bi-people-fill"></i></div>
                <div>
                  <div class="chat-header-name">{{ selectedStudent ? selectedStudent.name : 'Umumiy chat' }}</div>
                  <div class="chat-header-sub">{{ selectedRoom === 'general' ? 'Hammaga ko\'rinadigan' : 'Shaxsiy chat' }}</div>
                </div>
              </div>
              <ChatBox
                :room-id="selectedRoom"
                :current-user-id="authStore.user?._id"
                :is-admin="true"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Statistika -->
      <div v-if="activeTab === 'stats'" class="tab-content">
        <div class="page-header">
          <h2 class="page-title">Statistika</h2>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-icon"><i class="bi bi-people-fill"></i></div>
            <div class="stat-card-val">{{ students.length }}</div>
            <div class="stat-card-lbl">Jami o'quvchilar</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon"><i class="bi bi-graph-up"></i></div>
            <div class="stat-card-val">{{ avgScore }}</div>
            <div class="stat-card-lbl">O'rtacha ball</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon"><i class="bi bi-check-circle-fill"></i></div>
            <div class="stat-card-val">{{ activeStudents }}</div>
            <div class="stat-card-lbl">Faol o'quvchilar</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon"><i class="bi bi-award-fill"></i></div>
            <div class="stat-card-val">{{ topScorer?.name || '-' }}</div>
            <div class="stat-card-lbl">Eng yaxshi o'quvchi</div>
          </div>
        </div>

        <!-- Level distribution -->
        <div class="card-dark p-4 mt-4">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">Darajalar taqsimoti</h5>
          <div class="level-bars">
            <div v-for="lvl in levelStats" :key="lvl.name" class="level-row">
              <div class="level-label">
                <span class="badge" :class="`badge-${lvl.name.toLowerCase()}`">{{ lvl.name }}</span>
              </div>
              <div class="level-bar-wrap">
                <div class="level-bar-fill" :style="`width:${lvl.pct}%`"></div>
              </div>
              <div class="level-count">{{ lvl.count }}</div>
            </div>
          </div>
        </div>

        <!-- Top students -->
        <div class="card-dark p-4 mt-4">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">
            <i class="bi bi-trophy me-2" style="color:#f59e0b"></i>Top o'quvchilar
          </h5>
          <div class="top-list">
            <div v-for="(s, i) in topStudents" :key="s._id" class="top-row">
              <div class="top-rank" :class="['gold','silver','bronze'][i] || ''">{{ i + 1 }}</div>
              <div class="top-avatar">{{ s.name?.charAt(0)?.toUpperCase() }}</div>
              <div class="top-info">
                <div class="top-name">{{ s.name }}</div>
                <span class="badge" :class="`badge-${s.level?.toLowerCase()}`" style="font-size:0.65rem">{{ s.level }}</span>
              </div>
              <div class="top-score">{{ s.totalScore || 0 }} <span style="color:var(--text-muted);font-size:0.75rem">ball</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import ChatBox from '../components/ChatBox.vue';
import { useAuthStore } from '../store/auth.js';
import api from '../utils/axios.js';

export default {
  name: 'MentorPage',
  components: { ChatBox },
  setup() {
    const authStore = useAuthStore();
    const students = ref([]);
    const activeTab = ref('students');
    const selectedRoom = ref(null);
    const selectedStudent = ref(null);
    const searchQuery = ref('');

    const navItems = [
      { key: 'students', label: "O'quvchilar", icon: 'bi bi-people' },
      { key: 'chat', label: 'Chatlar', icon: 'bi bi-chat-dots' },
      { key: 'stats', label: 'Statistika', icon: 'bi bi-bar-chart' }
    ];

    const filteredStudents = computed(() =>
      students.value.filter((s) =>
        s.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const avgScore = computed(() => {
      if (!students.value.length) return 0;
      const total = students.value.reduce((sum, s) => sum + (s.totalScore || 0), 0);
      return Math.round(total / students.value.length);
    });

    const activeStudents = computed(() =>
      students.value.filter((s) => (s.completedVideos?.length || 0) > 0).length
    );

    const topScorer = computed(() =>
      [...students.value].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))[0]
    );

    const topStudents = computed(() =>
      [...students.value].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0)).slice(0, 5)
    );

    const levelStats = computed(() => {
      const levels = ['Beginner', 'Intermediate', 'Advanced'];
      return levels.map((name) => {
        const count = students.value.filter((s) => s.level === name).length;
        const pct = students.value.length ? Math.round((count / students.value.length) * 100) : 0;
        return { name, count, pct };
      });
    });

    const openChat = (s) => {
      selectedStudent.value = s;
      selectedRoom.value = `private-${s._id}`;
      activeTab.value = 'chat';
    };

    const selectRoom = (room, student) => {
      selectedRoom.value = room;
      selectedStudent.value = student;
    };

    onMounted(async () => {
      try {
        const { data } = await api.get('/mentor/students');
        students.value = data;
      } catch (_) {}
    });

    return {
      authStore, students, activeTab, selectedRoom, selectedStudent,
      searchQuery, navItems, filteredStudents, avgScore, activeStudents,
      topScorer, topStudents, levelStats, openChat, selectRoom
    };
  }
};
</script>

<style scoped>
.mentor-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-dark);
}

/* Sidebar */
.mentor-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid var(--border);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--primary);
}

.sidebar-logo i { font-size: 1.3rem; }

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.88rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
}

.nav-item:hover { background: rgba(79,70,229,0.08); color: var(--text-light); }
.nav-item.active { background: rgba(79,70,229,0.15); color: #818cf8; }
.nav-item i { font-size: 1rem; width: 18px; text-align: center; }

.nav-badge {
  margin-left: auto;
  background: var(--primary);
  color: #fff;
  font-size: 0.65rem;
  padding: 1px 7px;
  border-radius: 20px;
  font-weight: 700;
}

.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border);
}

.mentor-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mentor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.mentor-name { font-size: 0.85rem; font-weight: 600; color: var(--text-light); }
.mentor-role { font-size: 0.72rem; color: #6ee7b7; }

/* Main */
.mentor-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.tab-content { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-light);
  margin: 0;
}

.count-badge {
  background: rgba(79,70,229,0.15);
  color: #818cf8;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
}

/* Students grid */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
}

.student-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-wrap: wrap;
}

.student-card:hover {
  border-color: rgba(79,70,229,0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79,70,229,0.12);
}

.student-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.student-info { flex: 1; min-width: 0; }
.student-name { font-weight: 600; color: var(--text-light); font-size: 0.95rem; margin-bottom: 0.15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.student-email { font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.student-meta { display: flex; align-items: center; gap: 0.4rem; }

.score-pill {
  background: rgba(79,70,229,0.12);
  color: #818cf8;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.student-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-item { text-align: center; }
.stat-val { font-weight: 700; color: var(--primary); font-size: 0.95rem; }
.stat-lbl { font-size: 0.65rem; color: var(--text-muted); }

.chat-btn {
  background: rgba(79,70,229,0.12);
  border: 1px solid rgba(79,70,229,0.25);
  color: #818cf8;
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.chat-btn:hover { background: rgba(79,70,229,0.25); }

/* Chat layout */
.chat-layout {
  display: flex;
  gap: 1rem;
  height: calc(100vh - 140px);
}

.chat-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow-y: auto;
  padding: 0.75rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
}

.search-box i { color: var(--text-muted); font-size: 0.85rem; }
.search-box input { background: none; border: none; outline: none; color: var(--text-light); font-size: 0.85rem; flex: 1; }
.search-box input::placeholder { color: var(--text-muted); }

.chat-divider {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0.5rem 0.3rem;
}

.chat-room-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 0.2rem;
}

.chat-room-item:hover { background: rgba(79,70,229,0.08); }
.chat-room-item.active { background: rgba(79,70,229,0.15); }

.room-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.room-avatar.general { background: rgba(79,70,229,0.2); color: #818cf8; }
.room-avatar.student { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; }

.room-name { font-size: 0.85rem; font-weight: 600; color: var(--text-light); }
.room-sub { font-size: 0.72rem; color: var(--text-muted); }

.chat-main {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 0.75rem;
}

.chat-active {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-dark);
  flex-shrink: 0;
}

.chat-header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.chat-header-avatar.general-icon { background: rgba(79,70,229,0.2); color: #818cf8; }
.chat-header-name { font-weight: 600; color: var(--text-light); font-size: 0.95rem; }
.chat-header-sub { font-size: 0.72rem; color: var(--text-muted); }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover { transform: translateY(-2px); }

.stat-card-icon {
  width: 48px;
  height: 48px;
  background: rgba(79,70,229,0.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  font-size: 1.3rem;
  color: var(--primary);
}

.stat-card-val { font-size: 1.6rem; font-weight: 800; color: var(--text-light); margin-bottom: 0.2rem; }
.stat-card-lbl { font-size: 0.8rem; color: var(--text-muted); }

/* Level bars */
.level-bars { display: flex; flex-direction: column; gap: 0.75rem; }
.level-row { display: flex; align-items: center; gap: 1rem; }
.level-label { width: 110px; flex-shrink: 0; }
.level-bar-wrap { flex: 1; height: 8px; background: var(--bg-dark); border-radius: 4px; overflow: hidden; }
.level-bar-fill { height: 100%; background: linear-gradient(90deg, #4f46e5, #7c3aed); border-radius: 4px; transition: width 0.5s; }
.level-count { width: 30px; text-align: right; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }

/* Top students */
.top-list { display: flex; flex-direction: column; gap: 0.75rem; }
.top-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-dark);
  border-radius: 10px;
}

.top-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-card2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.top-rank.gold { background: rgba(245,158,11,0.2); color: #f59e0b; }
.top-rank.silver { background: rgba(148,163,184,0.2); color: #94a3b8; }
.top-rank.bronze { background: rgba(180,83,9,0.2); color: #b45309; }

.top-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.top-info { flex: 1; }
.top-name { font-size: 0.9rem; font-weight: 600; color: var(--text-light); margin-bottom: 0.15rem; }
.top-score { font-size: 1rem; font-weight: 700; color: var(--primary); }

@media (max-width: 768px) {
  .mentor-sidebar { display: none; }
  .mentor-main { padding: 1rem; }
  .chat-layout { flex-direction: column; height: auto; }
  .chat-sidebar { width: 100%; height: 200px; }
}
</style>
