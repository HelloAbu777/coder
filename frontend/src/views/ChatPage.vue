<template>
  <div class="container py-5">
    <h2 class="section-title mb-5">Chat</h2>
    <div class="row g-4">
      <!-- Kanal tanlash -->
      <div class="col-lg-3">
        <div class="card-dark p-3">
          <p class="small fw-semibold mb-3" style="color:var(--text-muted)">Kanallar</p>
          <div
            class="d-flex align-items-center gap-2 px-3 py-2 rounded mb-2"
            :style="activeRoom === 'general' ? 'background:rgba(79,70,229,0.15)' : ''"
            style="cursor:pointer"
            @click="activeRoom = 'general'">
            <i class="bi bi-hash" style="color:var(--primary)"></i>
            <span class="small" style="color:var(--text-light)">Umumiy chat</span>
          </div>
          <div
            v-if="authStore.isMentor || authStore.isAdmin"
            class="d-flex align-items-center gap-2 px-3 py-2 rounded"
            :style="activeRoom === 'mentor' ? 'background:rgba(79,70,229,0.15)' : ''"
            style="cursor:pointer"
            @click="activeRoom = 'mentor'">
            <i class="bi bi-person-workspace" style="color:var(--success)"></i>
            <span class="small" style="color:var(--text-light)">Mentor kanali</span>
          </div>

          <hr style="border-color:var(--border)">
          <p class="small fw-semibold mb-3" style="color:var(--text-muted)">Shaxsiy</p>
          <div
            class="d-flex align-items-center gap-2 px-3 py-2 rounded"
            :style="activeRoom === `private-${authStore.user?._id}` ? 'background:rgba(79,70,229,0.15)' : ''"
            style="cursor:pointer"
            @click="activeRoom = `private-${authStore.user?._id}`">
            <i class="bi bi-person-circle" style="color:var(--primary)"></i>
            <span class="small" style="color:var(--text-light)">Mentor bilan</span>
          </div>
        </div>
      </div>

      <!-- Chat -->
      <div class="col-lg-9">
        <div class="card-dark p-3">
          <div class="d-flex align-items-center gap-2 mb-3 pb-3" style="border-bottom:1px solid var(--border)">
            <i class="bi bi-hash" style="color:var(--primary)"></i>
            <span class="fw-semibold" style="color:var(--text-light)">{{ activeRoom }}</span>
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
import { ref } from 'vue';
import ChatBox from '../components/ChatBox.vue';
import { useAuthStore } from '../store/auth.js';

export default {
  name: 'ChatPage',
  components: { ChatBox },
  setup() {
    const authStore = useAuthStore();
    const activeRoom = ref('general');
    return { authStore, activeRoom };
  }
};
</script>
