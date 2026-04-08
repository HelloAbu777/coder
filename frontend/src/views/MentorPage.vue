<template>
  <div class="container py-5">
    <h2 class="section-title mb-5">Mentor Panel</h2>

    <div class="row g-4">
      <!-- O'quvchilar ro'yxati -->
      <div class="col-lg-4">
        <div class="card-dark p-4" style="max-height:70vh;overflow-y:auto">
          <h5 class="fw-semibold mb-4" style="color:var(--text-light)">O'quvchilar ({{ students.length }})</h5>
          <div v-if="students.length === 0" class="text-center py-4" style="color:var(--text-muted)">
            <i class="bi bi-people fs-2 d-block mb-2"></i>
            <p class="small">O'quvchilar yo'q</p>
          </div>
          <div
            v-for="s in students" :key="s._id"
            class="d-flex align-items-center gap-3 p-2 rounded mb-2"
            :style="selectedStudent?._id === s._id ? 'background:rgba(79,70,229,0.15)' : 'background:var(--bg-card2)'"
            style="cursor:pointer"
            @click="selectStudent(s)">
            <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style="width:36px;height:36px;background:var(--bg-card);color:var(--primary);font-weight:700">
              {{ s.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="small fw-semibold text-truncate" style="color:var(--text-light)">{{ s.name }}</div>
              <span class="badge" :class="`badge-${s.level?.toLowerCase()}`" style="font-size:0.65rem">{{ s.level }}</span>
            </div>
            <div class="text-end">
              <div class="small fw-bold" style="color:var(--primary)">{{ s.totalScore }}</div>
              <div class="small" style="color:var(--text-muted)">ball</div>
            </div>
          </div>
        </div>
      </div>

      <!-- O'quvchi detail + Chat -->
      <div class="col-lg-8">
        <div v-if="!selectedStudent" class="card-dark d-flex align-items-center justify-content-center" style="height:400px">
          <div class="text-center" style="color:var(--text-muted)">
            <i class="bi bi-person-circle fs-1 d-block mb-3"></i>
            <p>O'quvchini tanlang</p>
          </div>
        </div>
        <div v-else>
          <!-- O'quvchi ma'lumotlari -->
          <div class="card-dark p-4 mb-4">
            <div class="d-flex align-items-center gap-4">
              <div class="rounded-circle d-flex align-items-center justify-content-center"
                style="width:56px;height:56px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:1.5rem;font-weight:700">
                {{ selectedStudent.name?.charAt(0)?.toUpperCase() }}
              </div>
              <div>
                <h5 class="fw-bold mb-1" style="color:var(--text-light)">{{ selectedStudent.name }}</h5>
                <span class="badge me-2" :class="`badge-${selectedStudent.level?.toLowerCase()}`">{{ selectedStudent.level }}</span>
                <span class="small" style="color:var(--text-muted)">{{ selectedStudent.email }}</span>
              </div>
            </div>
            <div class="row g-3 mt-3">
              <div class="col-4 text-center">
                <div class="fw-bold" style="color:var(--primary)">{{ selectedStudent.completedVideos?.length || 0 }}</div>
                <div class="small" style="color:var(--text-muted)">Videolar</div>
              </div>
              <div class="col-4 text-center">
                <div class="fw-bold" style="color:var(--primary)">{{ selectedStudent.completedQuizzes?.length || 0 }}</div>
                <div class="small" style="color:var(--text-muted)">Testlar</div>
              </div>
              <div class="col-4 text-center">
                <div class="fw-bold" style="color:var(--primary)">{{ selectedStudent.totalScore || 0 }}</div>
                <div class="small" style="color:var(--text-muted)">Ball</div>
              </div>
            </div>
          </div>

          <!-- Chat -->
          <div class="card-dark p-3">
            <h6 class="fw-semibold mb-3" style="color:var(--text-light)">
              <i class="bi bi-chat-dots me-2" style="color:var(--primary)"></i>
              {{ selectedStudent.name }} bilan chat
            </h6>
            <ChatBox
              :room-id="`private-${selectedStudent._id}`"
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
  name: 'MentorPage',
  components: { ChatBox },
  setup() {
    const authStore = useAuthStore();
    const students = ref([]);
    const selectedStudent = ref(null);

    const selectStudent = (s) => { selectedStudent.value = s; };

    onMounted(async () => {
      try {
        const { data } = await api.get('/mentor/students');
        students.value = data;
      } catch (_) {}
    });

    return { students, selectedStudent, selectStudent, authStore };
  }
};
</script>
