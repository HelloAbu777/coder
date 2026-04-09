<template>
  <div class="chat-wrap" @click="closeContextMenu">

    <!-- Bulk delete toolbar -->
    <transition name="toolbar-slide">
      <div v-if="selectedIds.length > 0" class="bulk-toolbar">
        <span class="bulk-count">
          <i class="bi bi-check-square me-2"></i>{{ selectedIds.length }} ta tanlandi
        </span>
        <div class="d-flex gap-2">
          <button class="bulk-cancel-btn" @click="clearSelection">Bekor</button>
          <button class="bulk-delete-btn" @click="bulkDelete">
            <i class="bi bi-trash me-1"></i>O'chirish
          </button>
        </div>
      </div>
    </transition>

    <!-- Xabarlar -->
    <div ref="messagesEl" class="chat-messages" @click="closeContextMenu">
      <div v-if="messages.length === 0" class="chat-empty">
        <i class="bi bi-chat-dots"></i>
        <p>Hali xabar yo'q</p>
      </div>

      <div
        v-for="msg in messages" :key="msg._id"
        class="chat-msg-row"
        :class="[
          msg.sender?._id === currentUserId ? 'mine' : 'theirs',
          { selected: selectedIds.includes(msg._id) }
        ]"
        @contextmenu.prevent="openContextMenu($event, msg)"
        @click="onRowClick(msg)">

        <!-- Checkbox (selection mode) -->
        <div v-if="selectedIds.length > 0" class="msg-checkbox" @click.stop="toggleSelect(msg._id)">
          <div class="cb-box" :class="{ checked: selectedIds.includes(msg._id) }">
            <i v-if="selectedIds.includes(msg._id)" class="bi bi-check"></i>
          </div>
        </div>

        <div v-if="msg.sender?._id !== currentUserId" class="chat-avatar">
          {{ msg.sender?.name?.charAt(0)?.toUpperCase() }}
        </div>

        <div class="chat-bubble-wrap">
          <div v-if="msg.sender?._id !== currentUserId" class="chat-sender-name">
            {{ msg.sender?.name }}
            <span v-if="msg.sender?.role === 'mentor'" class="mentor-tag">Mentor</span>
            <span v-if="msg.sender?.role === 'admin'" class="admin-tag">Admin</span>
          </div>

          <!-- Edit mode -->
          <div v-if="editingId === msg._id" class="edit-wrap">
            <input
              v-model="editingContent"
              class="edit-input"
              @keyup.enter="saveEdit"
              @keyup.escape="cancelEdit"
              ref="editInputRef"
            />
            <div class="edit-actions">
              <button class="edit-save-btn" @click="saveEdit">
                <i class="bi bi-check-lg me-1"></i>Saqlash
              </button>
              <button class="edit-cancel-btn" @click="cancelEdit">Bekor</button>
            </div>
          </div>

          <!-- Normal bubble -->
          <div v-else class="chat-bubble" :class="msg.sender?._id === currentUserId ? 'bubble-mine' : 'bubble-theirs'">
            {{ msg.content }}
          </div>

          <div class="chat-time">
            {{ formatTime(msg.createdAt) }}
            <span v-if="msg.isEdited" class="edited-tag">tahrirlangan</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Context menu -->
    <transition name="ctx-fade">
      <div
        v-if="ctxMenu.visible"
        class="ctx-menu"
        :style="{ top: ctxMenu.y + 'px', left: ctxMenu.x + 'px' }"
        @click.stop>
        <button class="ctx-item" @click="copyMsg">
          <i class="bi bi-clipboard"></i> Nusxa olish
        </button>
        <button v-if="ctxMenu.isMine" class="ctx-item" @click="startEdit">
          <i class="bi bi-pencil"></i> Tahrirlash
        </button>
        <button class="ctx-item" @click="selectMsg">
          <i class="bi bi-check-square"></i> Tanlash
        </button>
        <div class="ctx-divider"></div>
        <button
          v-if="ctxMenu.isMine || isAdmin"
          class="ctx-item danger"
          @click="deleteSingle">
          <i class="bi bi-trash"></i> O'chirish
        </button>
      </div>
    </transition>

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
    const selectedIds = ref([]);
    const editingId = ref(null);
    const editingContent = ref('');
    const editInputRef = ref(null);
    const ctxMenu = ref({ visible: false, x: 0, y: 0, msgId: null, content: '', isMine: false });
    let socket = null;

    const scrollBottom = async () => {
      await nextTick();
      if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
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

      socket.on('disconnect', () => { connected.value = false; });

      socket.on('receive_message', (msg) => {
        if (!messages.value.some((m) => m._id === msg._id)) {
          messages.value.push(msg);
          scrollBottom();
        }
      });

      socket.on('message_deleted', (messageId) => {
        messages.value = messages.value.filter((m) => m._id !== messageId);
      });

      socket.on('messages_bulk_deleted', (ids) => {
        messages.value = messages.value.filter((m) => !ids.includes(m._id));
      });

      socket.on('message_edited', (updated) => {
        const idx = messages.value.findIndex((m) => m._id === updated._id);
        if (idx !== -1) messages.value[idx] = updated;
      });
    };

    // Send
    const send = async () => {
      if (!newMessage.value.trim()) return;
      try {
        const { data } = await api.post('/chat', { content: newMessage.value, roomId: props.roomId });
        messages.value.push(data);
        socket?.emit('send_message', { ...data, roomId: props.roomId });
        newMessage.value = '';
        scrollBottom();
      } catch (_) {}
    };

    // Context menu
    const openContextMenu = (e, msg) => {
      const isMine = msg.sender?._id === props.currentUserId;
      ctxMenu.value = {
        visible: true,
        x: Math.min(e.clientX, window.innerWidth - 180),
        y: e.clientY,
        msgId: msg._id,
        content: msg.content,
        isMine
      };
    };

    const closeContextMenu = () => { ctxMenu.value.visible = false; };

    const copyMsg = () => {
      navigator.clipboard?.writeText(ctxMenu.value.content);
      closeContextMenu();
    };

    const startEdit = () => {
      editingId.value = ctxMenu.value.msgId;
      editingContent.value = ctxMenu.value.content;
      closeContextMenu();
      nextTick(() => editInputRef.value?.focus());
    };

    const saveEdit = async () => {
      if (!editingContent.value.trim()) return;
      try {
        const { data } = await api.put(`/chat/${editingId.value}`, { content: editingContent.value });
        const idx = messages.value.findIndex((m) => m._id === editingId.value);
        if (idx !== -1) messages.value[idx] = data;
        socket?.emit('edit_message', { message: data, roomId: props.roomId });
        cancelEdit();
      } catch (_) {}
    };

    const cancelEdit = () => {
      editingId.value = null;
      editingContent.value = '';
    };

    // Selection
    const toggleSelect = (id) => {
      const i = selectedIds.value.indexOf(id);
      if (i === -1) selectedIds.value.push(id);
      else selectedIds.value.splice(i, 1);
    };

    const selectMsg = () => {
      toggleSelect(ctxMenu.value.msgId);
      closeContextMenu();
    };

    const clearSelection = () => { selectedIds.value = []; };

    const onRowClick = (msg) => {
      if (selectedIds.value.length > 0) toggleSelect(msg._id);
    };

    // Delete single
    const deleteSingle = async () => {
      const id = ctxMenu.value.msgId;
      closeContextMenu();
      try {
        await api.delete(`/chat/${id}`);
        messages.value = messages.value.filter((m) => m._id !== id);
        socket?.emit('delete_message', { messageId: id, roomId: props.roomId });
      } catch (_) {}
    };

    // Bulk delete
    const bulkDelete = async () => {
      const ids = [...selectedIds.value];
      try {
        await api.delete('/chat/bulk', { data: { ids } });
        messages.value = messages.value.filter((m) => !ids.includes(m._id));
        socket?.emit('bulk_delete_messages', { ids, roomId: props.roomId });
        clearSelection();
      } catch (_) {}
    };

    onMounted(() => { loadMessages(); initSocket(); });
    onUnmounted(() => { socket?.disconnect(); });

    watch(() => props.roomId, () => {
      socket?.emit('join_room', props.roomId);
      clearSelection();
      cancelEdit();
      loadMessages();
    });

    return {
      messages, newMessage, messagesEl, connected,
      selectedIds, editingId, editingContent, editInputRef,
      ctxMenu,
      send, formatTime,
      openContextMenu, closeContextMenu, copyMsg,
      startEdit, saveEdit, cancelEdit,
      toggleSelect, selectMsg, clearSelection, onRowClick,
      deleteSingle, bulkDelete
    };
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
  position: relative;
}

/* Bulk toolbar */
.bulk-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.6rem 1rem;
  background: rgba(79,70,229,0.15);
  border-bottom: 1px solid rgba(79,70,229,0.3);
  flex-shrink: 0;
}
.bulk-count { font-size: 0.85rem; font-weight: 600; color: #a5b4fc; }
.bulk-cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #94a3b8; padding: 4px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; }
.bulk-delete-btn { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 4px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; }
.bulk-delete-btn:hover { background: rgba(239,68,68,0.25); }

.toolbar-slide-enter-active, .toolbar-slide-leave-active { transition: all 0.2s; }
.toolbar-slide-enter-from, .toolbar-slide-leave-to { opacity: 0; transform: translateY(-100%); }

/* Messages */
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
  cursor: default;
  border-radius: 12px;
  transition: background 0.15s;
  padding: 2px 4px;
}
.chat-msg-row.mine { flex-direction: row-reverse; }
.chat-msg-row.mine .chat-bubble-wrap { align-items: flex-end; }
.chat-msg-row.selected { background: rgba(79,70,229,0.1); }

/* Checkbox */
.msg-checkbox { display: flex; align-items: center; flex-shrink: 0; cursor: pointer; }
.cb-box {
  width: 20px; height: 20px;
  border: 2px solid rgba(79,70,229,0.4);
  border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; transition: all 0.15s;
}
.cb-box.checked { background: #4f46e5; border-color: #4f46e5; color: #fff; font-size: 0.75rem; }

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
.mentor-tag { background: rgba(16,185,129,0.15); color: #6ee7b7; padding: 1px 6px; border-radius: 10px; font-size: 0.68rem; }
.admin-tag { background: rgba(239,68,68,0.15); color: #fca5a5; padding: 1px 6px; border-radius: 10px; font-size: 0.68rem; }

.chat-bubble {
  padding: 0.6rem 1rem;
  border-radius: 16px;
  font-size: 0.9rem; line-height: 1.5;
  word-break: break-word;
}
.bubble-mine { background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; border-bottom-right-radius: 4px; }
.bubble-theirs { background: rgba(30,30,50,0.8); color: #e2e8f0; border: 1px solid rgba(79,70,229,0.15); border-bottom-left-radius: 4px; }

.chat-time { font-size: 0.7rem; color: #475569; padding: 0 0.5rem; display: flex; align-items: center; gap: 0.4rem; }
.edited-tag { font-size: 0.65rem; color: #64748b; font-style: italic; }

/* Edit mode */
.edit-wrap { display: flex; flex-direction: column; gap: 0.4rem; min-width: 200px; }
.edit-input {
  background: rgba(15,15,40,0.9);
  border: 1px solid #4f46e5;
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  color: #f1f5f9;
  font-size: 0.9rem;
  outline: none;
  width: 100%;
}
.edit-actions { display: flex; gap: 0.4rem; }
.edit-save-btn { background: #4f46e5; border: none; color: #fff; padding: 3px 12px; border-radius: 6px; font-size: 0.78rem; cursor: pointer; }
.edit-cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 3px 10px; border-radius: 6px; font-size: 0.78rem; cursor: pointer; }

/* Context menu */
.ctx-menu {
  position: fixed;
  background: #1a1a2e;
  border: 1px solid rgba(79,70,229,0.25);
  border-radius: 10px;
  padding: 0.4rem;
  min-width: 165px;
  z-index: 999;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.ctx-item {
  display: flex; align-items: center; gap: 0.6rem;
  width: 100%; padding: 0.5rem 0.75rem;
  background: none; border: none;
  color: #cbd5e1; font-size: 0.85rem;
  cursor: pointer; border-radius: 6px;
  text-align: left; transition: background 0.15s;
}
.ctx-item:hover { background: rgba(79,70,229,0.12); color: #f1f5f9; }
.ctx-item.danger { color: #fca5a5; }
.ctx-item.danger:hover { background: rgba(239,68,68,0.12); }
.ctx-item i { font-size: 0.9rem; width: 16px; text-align: center; }
.ctx-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 0.3rem 0; }

.ctx-fade-enter-active, .ctx-fade-leave-active { transition: opacity 0.12s, transform 0.12s; }
.ctx-fade-enter-from, .ctx-fade-leave-to { opacity: 0; transform: scale(0.95); }

/* Input */
.chat-input-wrap { border-top: 1px solid rgba(79,70,229,0.1); padding: 0.8rem 1rem; background: #0a0a14; }
.chat-input-box { display: flex; gap: 0.5rem; }
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
.chat-status { margin-top: 0.4rem; font-size: 0.72rem; }
.status-online { color: #10b981; }
.status-offline { color: #64748b; }
.status-online i, .status-offline i { font-size: 0.5rem; }
</style>
