<template>
  <div class="d-flex flex-column" style="height:500px">
    <div ref="messagesEl" class="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2" style="background:var(--bg-card2);border-radius:12px 12px 0 0">
      <div v-if="messages.length === 0" class="text-center my-auto" style="color:var(--text-muted)">
        <i class="bi bi-chat-dots fs-2"></i>
        <p class="mt-2 small">Hali xabar yo'q</p>
      </div>
      <div v-for="msg in messages" :key="msg._id"
        class="d-flex gap-2"
        :class="msg.sender._id === currentUserId ? 'flex-row-reverse' : ''">
        <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style="width:32px;height:32px;background:var(--bg-card);font-size:0.75rem;color:var(--primary)">
          {{ msg.sender.name?.charAt(0)?.toUpperCase() }}
        </div>
        <div style="max-width:70%">
          <div class="small mb-1 d-flex gap-2" :class="msg.sender._id === currentUserId ? 'justify-content-end' : ''">
            <span style="color:var(--primary)">{{ msg.sender.name }}</span>
            <span v-if="msg.sender.role === 'mentor'" class="badge bg-success" style="font-size:0.6rem">Mentor</span>
          </div>
          <div class="px-3 py-2 rounded-3 small"
            :style="msg.sender._id === currentUserId
              ? 'background:var(--primary);color:#fff'
              : 'background:var(--bg-card);color:var(--text-light)'">
            {{ msg.content }}
          </div>
        </div>
        <button v-if="msg.sender._id === currentUserId || isAdmin"
          class="btn btn-sm p-0 align-self-center"
          style="color:var(--text-muted);opacity:0.5"
          @click="deleteMsg(msg._id)">
          <i class="bi bi-trash small"></i>
        </button>
      </div>
    </div>

    <div class="d-flex gap-2 p-2" style="background:var(--bg-card);border-radius:0 0 12px 12px;border-top:1px solid var(--border)">
      <input
        v-model="newMessage"
        type="text"
        class="form-control form-control-sm"
        placeholder="Xabar yozing..."
        @keyup.enter="send"
      />
      <button class="btn btn-primary btn-sm px-3" @click="send">
        <i class="bi bi-send"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue';
import api from '../utils/axios.js';

export default {
  name: 'ChatBox',
  props: {
    roomId: { type: String, required: true },
    currentUserId: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  setup(props) {
    const messages = ref([]);
    const newMessage = ref('');
    const messagesEl = ref(null);

    const scrollBottom = async () => {
      await nextTick();
      if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    };

    const loadMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${props.roomId}`);
        messages.value = data;
        scrollBottom();
      } catch (_) {}
    };

    const send = async () => {
      if (!newMessage.value.trim()) return;
      try {
        const { data } = await api.post('/chat', { content: newMessage.value, roomId: props.roomId });
        messages.value.push(data);
        newMessage.value = '';
        scrollBottom();
      } catch (_) {}
    };

    const deleteMsg = async (id) => {
      try {
        await api.delete(`/chat/${id}`);
        messages.value = messages.value.filter((m) => m._id !== id);
      } catch (_) {}
    };

    onMounted(loadMessages);
    watch(() => props.roomId, loadMessages);

    return { messages, newMessage, messagesEl, send, deleteMsg };
  }
};
</script>
