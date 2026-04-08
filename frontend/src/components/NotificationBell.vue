<template>
  <div class="dropdown">
    <button class="btn btn-sm position-relative" style="color:var(--text-light)" data-bs-toggle="dropdown" @click="loadNotifications">
      <i class="bi bi-bell fs-5"></i>
      <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:0.65rem">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>
    <div class="dropdown-menu dropdown-menu-end p-0" style="background:var(--bg-card);border-color:var(--border);width:320px;max-height:400px;overflow-y:auto">
      <div class="d-flex justify-content-between align-items-center px-3 py-2" style="border-bottom:1px solid var(--border)">
        <span class="fw-semibold" style="color:var(--text-light)">Bildirishnomalar</span>
        <button v-if="unreadCount > 0" class="btn btn-sm btn-link p-0" style="color:var(--primary);font-size:0.8rem" @click="markAll">
          Barchasini o'qi
        </button>
      </div>

      <div v-if="notifications.length === 0" class="text-center py-4" style="color:var(--text-muted)">
        <i class="bi bi-bell-slash fs-3"></i>
        <p class="mt-2 mb-0 small">Bildirishnoma yo'q</p>
      </div>

      <div v-for="n in notifications" :key="n._id"
        class="px-3 py-2 d-flex gap-2 align-items-start"
        style="border-bottom:1px solid var(--border);cursor:pointer"
        :style="!n.isRead ? 'background:rgba(79,70,229,0.08)' : ''"
        @click="readNotification(n)">
        <i :class="iconMap[n.type]" class="mt-1 flex-shrink-0" style="color:var(--primary)"></i>
        <div>
          <div class="fw-semibold small" style="color:var(--text-light)">{{ n.title }}</div>
          <div class="small" style="color:var(--text-muted)">{{ n.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '../utils/axios.js';
import { useRouter } from 'vue-router';

export default {
  name: 'NotificationBell',
  setup() {
    const notifications = ref([]);
    const unreadCount = ref(0);
    const router = useRouter();

    const iconMap = {
      new_video: 'bi bi-play-circle',
      quiz_result: 'bi bi-patch-check',
      level_up: 'bi bi-trophy',
      certificate: 'bi bi-award',
      mentor_message: 'bi bi-chat-dots'
    };

    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        notifications.value = data;
        unreadCount.value = data.filter((n) => !n.isRead).length;
      } catch (_) {}
    };

    const markAll = async () => {
      try {
        await api.put('/notifications/read-all');
        notifications.value.forEach((n) => { n.isRead = true; });
        unreadCount.value = 0;
      } catch (_) {}
    };

    const readNotification = async (n) => {
      if (!n.isRead) {
        try {
          await api.put(`/notifications/${n._id}/read`);
          n.isRead = true;
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        } catch (_) {}
      }
      if (n.link) router.push(n.link);
    };

    loadNotifications();

    return { notifications, unreadCount, iconMap, loadNotifications, markAll, readNotification };
  }
};
</script>
