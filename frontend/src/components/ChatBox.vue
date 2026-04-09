<template>
  <div class="chat-wrap">
    <!-- Xabarlar -->
    <div ref="messagesEl" class="chat-messages">
      <div v-if="messages.length === 0" class="chat-empty">
        <i class="bi bi-chat-dots"></i>
        <p>Hali xabar yo'q</p>
      </div>

      <div v-for="msg in messages" :key="msg._id"
        class="chat-msg-row"
        :class="msg.sender?._id === currentUserId ? 'mine' : 'theirs'">

        <div v-if="msg.sender?._id !== currentUserId" class="chat-avatar">
          {{ msg.sender?.name?.charAt(0)?.toUpperCase() }}
        </div>

        <div class="chat-bubble-wrap">
          <div v-if="msg.sender?._id !== currentUserId" class="chat-sender-name">
            {{ msg.sender?.name }}
            <span v-if="msg.sender?.role === 'mentor'" class="mentor-tag">Mentor</span>
          </div>
          <div class="chat-bubble" :class="msg.sender?._id === currentUserId ? 'bubble-mine' : 'bubble-theirs'">
            {{ msg.content }}
          </div>
          <div class="chat-time">{{ formatTime(msg.createdAt) }}</div>
        </div>

        <button v-if="msg.sender?._id === currentUserId || isAdmin"
          class="chat-delete-btn" @click="deleteMsg(msg._id)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input-wrap">
      <div class="chat-input-box">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Xabar yozing..."
          @keyup.enter="send"
        />
        <button class="chat-send-btn" @click="send" :disabled="!newMessage.trim()">
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
      <div class="chat-status">
        <span v-if="connected" class="status-online"><i class="bi bi-circle-fill"></i> Online</span>
        <span v-else class="status-offline"><i class="bi bi-circle"></i> Ulanmoqda...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { io } from 'socket.io-client';
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
    const connected = ref(false);
    let socket = null;

    const scrollBottom = async () => {
      await nextTick();
      if (messagesEl.value) {
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
      }
    };

    const formatTime = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    };

    const loadMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${props.roomId}`);
        messages.value = data;
        scrollBottom();
      } catch (_) {}
    };

    const initSocket = () => {
      const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      socket = io(backendUrl, {
        auth: { token: localStorage.getItem('token') },
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        connected.value = true;
        socket.emit('join_room', props.roomId);
      });

      socket.on('disconnect', () => {
        connected.value = false;
      });

      socket.on('receive_message', (msg) => {
        const exists = messages.value.some((m) => m._id === msg._id);
        if (!exists) {
          messages.value.push(msg);
          scrollBottom();
        }
      });
    };

    const send = async () => {
      if (!newMessage.value.trim()) return;
      try {
        const { data } = await api.post('/chat', {
          content: newMessage.value,
          roomId: props.roomId
        });
        messages.value.push(data);
        socket?.emit('send_message', { ...data, roomId: props.roomId });
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

    onMounted(() => {
      loadMessages();
      initSocket();
    });

    onUnmounted(() => {
      socket?.disconnect();
    });

    watch(() => props.roomId, () => {
      socket?.emit('join_room', props.roomId);
      loadMessages();
    });

    return { messages, newMessage, messagesEl, connected, send, deleteMsg, formatTime };
  }
};
</script>

<style scoped>
.chat-wrap {
  display: flex; flex-direction: column;
  height: 520px;
  background: #0f0f1e;
  border: 1px solid rgba(79,70,229,0.15);
  border-radius: 16px;
  overflow: hidden;
}

.chat-messages {
  flex: 1; overflow-y: auto;
  padding: 1.2rem;
  display: flex; flex-direction: column; gap: 0.8rem;
  scroll-behavior: smooth;
}

.chat-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  flex: 1; color: #475569; font-size: 0.9rem;
}
.chat-empty i { font-size: 2rem; margin-bottom: 0.5rem; }

.chat-msg-row {
  display: flex; align-items: flex-end; gap: 0.6rem;
}
.chat-msg-row.mine { flex-direction: row-reverse; }
.chat-msg-row.mine .chat-bubble-wrap { align-items: flex-end; }

.chat-avatar {
  width: 32px; height: 32px; flex-shrink: 0;
  background: rgba(79,70,229,0.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; color: #818cf8;
}

.chat-bubble-wrap {
  display: flex; flex-direction: column; gap: 0.2rem;
  max-width: 65%;
}

.chat-sender-name {
  font-size: 0.75rem; color: #818cf8;
  display: flex; align-items: center; gap: 0.4rem;
  padding-left: 0.5rem;
}
.mentor-tag {
  background: rgba(16,185,129,0.15);
  color: #6ee7b7; padding: 1px 6px;
  border-radius: 10px; font-size: 0.7rem;
}

.chat-bubble {
  padding: 0.6rem 1rem;
  border-radius: 16px;
  font-size: 0.9rem; line-height: 1.5;
  word-break: break-word;
}
.bubble-mine {
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.bubble-theirs {
  background: rgba(30,30,50,0.8);
  color: #e2e8f0;
  border: 1px solid rgba(79,70,229,0.15);
  border-bottom-left-radius: 4px;
}

.chat-time {
  font-size: 0.7rem; color: #475569;
  padding: 0 0.5rem;
}

.chat-delete-btn {
  background: none; border: none;
  color: #374151; cursor: pointer;
  font-size: 0.75rem; opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  padding: 4px;
}
.chat-msg-row:hover .chat-delete-btn { opacity: 1; }
.chat-delete-btn:hover { color: #ef4444; }

/* Input */
.chat-input-wrap {
  border-top: 1px solid rgba(79,70,229,0.1);
  padding: 0.8rem 1rem;
  background: #0a0a14;
}
.chat-input-box {
  display: flex; gap: 0.5rem;
}
.chat-input-box input {
  flex: 1; background: rgba(20,20,35,0.8);
  border: 1px solid rgba(79,70,229,0.2);
  border-radius: 10px; padding: 0.7rem 1rem;
  color: #f1f5f9; font-size: 0.9rem; outline: none;
  transition: border-color 0.2s;
}
.chat-input-box input:focus { border-color: #4f46e5; }
.chat-input-box input::placeholder { color: #475569; }

.chat-send-btn {
  width: 42px; height: 42px;
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
  border: none; border-radius: 10px;
  color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.2s;
}
.chat-send-btn:hover:not(:disabled) { opacity: 0.85; }
.chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.chat-status {
  margin-top: 0.4rem; font-size: 0.72rem;
}
.status-online { color: #10b981; }
.status-offline { color: #64748b; }
.status-online i, .status-offline i { font-size: 0.5rem; }
</style>
