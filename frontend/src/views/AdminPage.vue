<template>
  <div class="admin-layout">
    <!-- Chap sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-brand">CODERS</div>
      <nav class="admin-nav">
        <button v-for="t in tabs" :key="t.key"
          class="admin-nav-item"
          :class="{ active: activeTab === t.key }"
          @click="activeTab = t.key">
          <i :class="t.icon"></i>
          <span>{{ t.label }}</span>
        </button>
      </nav>
      <button class="admin-nav-item mt-auto" @click="logout">
        <i class="bi bi-box-arrow-left"></i>
        <span>Chiqish</span>
      </button>
    </aside>

    <!-- Asosiy kontent -->
    <main class="admin-main">

      <!-- Statistika -->
      <div class="admin-stats">
        <div v-for="s in statsCards" :key="s.label" class="admin-stat-card">
          <i :class="s.icon" class="admin-stat-icon"></i>
          <div class="admin-stat-value">{{ s.value }}</div>
          <div class="admin-stat-label">{{ s.label }}</div>
        </div>
      </div>

      <!-- Foydalanuvchilar -->
      <section v-if="activeTab === 'users'" class="admin-section">
        <div class="admin-section-header">
          <h3>Foydalanuvchilar</h3>
          <span class="badge-count">{{ users.length }} ta</span>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Ism</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Daraja</th>
                <th>To'lov</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u._id">
                <td>
                  <div class="user-name-cell">
                    <div class="user-avatar">{{ u.name?.charAt(0)?.toUpperCase() }}</div>
                    {{ u.name }}
                  </div>
                </td>
                <td class="text-muted">{{ u.email }}</td>
                <td><span class="role-badge" :class="u.role">{{ u.role }}</span></td>
                <td>{{ u.level }}</td>
                <td>
                  <i v-if="u.isPaid" class="bi bi-check-circle-fill" style="color:#10b981"></i>
                  <i v-else class="bi bi-x-circle" style="color:#ef4444"></i>
                </td>
                <td>
                  <span v-if="u.isBlocked" class="status-badge blocked">Bloklangan</span>
                  <span v-else class="status-badge active">Faol</span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="action-btn warn" @click="toggleBlock(u)">
                      <i :class="u.isBlocked ? 'bi bi-unlock' : 'bi bi-lock'"></i>
                    </button>
                    <button v-if="u.role === 'student'" class="action-btn info" @click="makeMentor(u._id)" title="Mentor qilish">
                      <i class="bi bi-person-workspace"></i>
                    </button>
                    <button class="action-btn danger" @click="deleteUser(u._id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- To'lovlar -->
      <section v-if="activeTab === 'payments'" class="admin-section">
        <div class="admin-section-header">
          <h3>To'lovlar</h3>
          <span class="badge-count">{{ payments.length }} ta</span>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Foydalanuvchi</th>
                <th>Summa</th>
                <th>Usul</th>
                <th>Holat</th>
                <th>Sana</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in payments" :key="p._id">
                <td>{{ p.user?.name }}</td>
                <td>{{ p.amount?.toLocaleString() }} so'm</td>
                <td class="text-muted">{{ p.method }}</td>
                <td><span class="payment-badge" :class="p.status">{{ p.status }}</span></td>
                <td class="text-muted">{{ p.paidAt ? new Date(p.paidAt).toLocaleDateString('uz-UZ') : '—' }}</td>
                <td>
                  <button v-if="p.status === 'paid'" class="action-btn danger" @click="refund(p._id)">
                    Qaytarish
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Video qo'shish -->
      <section v-if="activeTab === 'videos'" class="admin-section">
        <div class="admin-section-header">
          <h3>Video qo'shish</h3>
        </div>
        <div class="admin-form-wrap">
          <div v-if="videoSuccess" class="admin-alert success">
            <i class="bi bi-check-circle me-2"></i>Video muvaffaqiyatli qo'shildi!
          </div>
          <div v-if="videoError" class="admin-alert danger">
            <i class="bi bi-exclamation-circle me-2"></i>{{ videoError }}
          </div>

          <form @submit.prevent="addVideo" class="admin-form">
            <div class="form-row">
              <div class="admin-field">
                <label>Sarlavha</label>
                <input v-model="videoForm.title" type="text" placeholder="Video sarlavhasi" required />
              </div>
              <div class="admin-field">
                <label>Bo'lim</label>
                <select v-model="videoForm.section" required>
                  <option v-for="s in sectionList" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="admin-field">
                <label>Tartib raqam</label>
                <input v-model.number="videoForm.order" type="number" min="1" required />
              </div>
              <div class="admin-field">
                <label>Davomiyligi (soniya)</label>
                <input v-model.number="videoForm.duration" type="number" min="0" placeholder="600" />
              </div>
            </div>

            <!-- Yuklash turi -->
            <div class="upload-type-tabs">
              <button type="button" class="upload-tab" :class="{ active: uploadType === 'youtube' }" @click="uploadType = 'youtube'">
                <i class="bi bi-youtube me-2"></i>YouTube
              </button>
              <button type="button" class="upload-tab" :class="{ active: uploadType === 'file' }" @click="uploadType = 'file'">
                <i class="bi bi-upload me-2"></i>Kompyuterdan
              </button>
            </div>

            <!-- YouTube URL -->
            <div v-if="uploadType === 'youtube'" class="admin-field">
              <label>YouTube URL</label>
              <input v-model="videoForm.url" type="url" placeholder="https://youtube.com/watch?v=..." />
            </div>

            <!-- Fayl yuklash -->
            <div v-if="uploadType === 'file'" class="admin-field">
              <label>Video fayl</label>
              <div class="file-drop-zone" @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="onDrop">
                <input ref="fileInput" type="file" accept="video/*" style="display:none" @change="onFileChange" />
                <div v-if="!selectedFile">
                  <i class="bi bi-cloud-upload fs-2 mb-2 d-block" style="color:#4f46e5"></i>
                  <p class="mb-1">Faylni shu yerga tashlang yoki bosing</p>
                  <p class="small text-muted">MP4, WebM, MOV — max 500MB</p>
                </div>
                <div v-else class="selected-file">
                  <i class="bi bi-file-earmark-play fs-2 mb-2 d-block" style="color:#10b981"></i>
                  <p class="mb-1 fw-semibold">{{ selectedFile.name }}</p>
                  <p class="small text-muted">{{ (selectedFile.size / 1024 / 1024).toFixed(1) }} MB</p>
                </div>
              </div>
              <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                <div class="upload-progress-bar" :style="`width:${uploadProgress}%`"></div>
                <span>{{ uploadProgress }}%</span>
              </div>
            </div>

            <div class="admin-field">
              <label>Tavsif</label>
              <textarea v-model="videoForm.description" rows="3" placeholder="Video haqida qisqacha..."></textarea>
            </div>

            <button type="submit" class="admin-submit-btn" :disabled="videoLoading">
              <span v-if="videoLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-plus-circle me-2"></i>
              {{ videoLoading ? 'Yuklanmoqda...' : 'Video qo\'shish' }}
            </button>
          </form>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/axios.js';

export default {
  name: 'AdminPage',
  setup() {
    const router = useRouter();
    const activeTab = ref('users');
    const tabs = [
      { key: 'users', label: 'Foydalanuvchilar', icon: 'bi bi-people' },
      { key: 'payments', label: "To'lovlar", icon: 'bi bi-credit-card' },
      { key: 'videos', label: 'Video qo\'shish', icon: 'bi bi-play-circle' }
    ];

    const users = ref([]);
    const payments = ref([]);
    const statsCards = ref([]);
    const sectionList = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'];
    const videoLoading = ref(false);
    const videoSuccess = ref(false);
    const videoError = ref('');
    const uploadType = ref('youtube');
    const selectedFile = ref(null);
    const uploadProgress = ref(0);
    const fileInput = ref(null);

    const videoForm = reactive({
      title: '', url: '', section: 'HTML',
      order: 1, description: '', duration: 0
    });

    const loadData = async () => {
      try {
        const [statsRes, usersRes, paymentsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/payments')
        ]);
        const s = statsRes.data;
        statsCards.value = [
          { icon: 'bi bi-people-fill', value: s.totalUsers, label: "O'quvchilar" },
          { icon: 'bi bi-credit-card-fill', value: s.totalPaid, label: "To'langan" },
          { icon: 'bi bi-cash-stack', value: `${(s.totalRevenue / 1000).toFixed(0)}K so'm`, label: 'Daromad' },
          { icon: 'bi bi-play-circle-fill', value: s.totalVideos, label: 'Videolar' }
        ];
        users.value = usersRes.data;
        payments.value = paymentsRes.data;
      } catch (_) {}
    };

    const toggleBlock = async (u) => {
      try {
        await api.put(`/admin/users/${u._id}/block`);
        u.isBlocked = !u.isBlocked;
      } catch (_) {}
    };

    const makeMentor = async (id) => {
      try {
        await api.put(`/admin/users/${id}/mentor`);
        const u = users.value.find((x) => x._id === id);
        if (u) u.role = 'mentor';
      } catch (_) {}
    };

    const deleteUser = async (id) => {
      if (!confirm("Foydalanuvchini o'chirasizmi?")) return;
      try {
        await api.delete(`/admin/users/${id}`);
        users.value = users.value.filter((u) => u._id !== id);
      } catch (_) {}
    };

    const refund = async (id) => {
      if (!confirm("To'lovni qaytarasizmi?")) return;
      try {
        await api.put(`/admin/payments/${id}/refund`);
        const p = payments.value.find((x) => x._id === id);
        if (p) p.status = 'refunded';
      } catch (_) {}
    };

    const onFileChange = (e) => {
      selectedFile.value = e.target.files[0] || null;
    };

    const onDrop = (e) => {
      selectedFile.value = e.dataTransfer.files[0] || null;
    };

    const addVideo = async () => {
      videoLoading.value = true;
      videoSuccess.value = false;
      videoError.value = '';
      uploadProgress.value = 0;

      try {
        if (uploadType.value === 'file' && selectedFile.value) {
          const formData = new FormData();
          formData.append('video', selectedFile.value);
          formData.append('title', videoForm.title);
          formData.append('section', videoForm.section);
          formData.append('order', videoForm.order);
          formData.append('description', videoForm.description);
          formData.append('duration', videoForm.duration);

          await api.post('/videos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
              uploadProgress.value = Math.round((e.loaded / e.total) * 100);
            }
          });
        } else {
          await api.post('/videos', { ...videoForm });
        }

        videoSuccess.value = true;
        selectedFile.value = null;
        uploadProgress.value = 0;
        Object.assign(videoForm, { title: '', url: '', section: 'HTML', order: 1, description: '', duration: 0 });
        await loadData();
      } catch (err) {
        videoError.value = err.response?.data?.message || 'Xato yuz berdi';
      } finally {
        videoLoading.value = false;
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/admin/login');
    };

    onMounted(loadData);

    return {
      activeTab, tabs, users, payments, statsCards, sectionList,
      videoLoading, videoSuccess, videoError, uploadType,
      selectedFile, uploadProgress, fileInput, videoForm,
      toggleBlock, makeMentor, deleteUser, refund,
      onFileChange, onDrop, addVideo, logout
    };
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex; min-height: 100vh;
  background: #0a0a14; color: #e2e8f0;
}

/* Sidebar */
.admin-sidebar {
  width: 240px; flex-shrink: 0;
  background: #0f0f1e;
  border-right: 1px solid rgba(79,70,229,0.15);
  display: flex; flex-direction: column;
  padding: 1.5rem 1rem;
  position: sticky; top: 0; height: 100vh;
}
.admin-brand {
  font-size: 1.4rem; font-weight: 900; letter-spacing: 2px;
  background: linear-gradient(135deg,#4f46e5,#a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  padding: 0 0.5rem; margin-bottom: 2rem;
}
.admin-nav { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
.admin-nav-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; border-radius: 10px;
  border: none; background: transparent;
  color: #64748b; font-size: 0.9rem;
  cursor: pointer; transition: all 0.2s;
  text-decoration: none;
}
.admin-nav-item:hover { background: rgba(79,70,229,0.1); color: #a5b4fc; }
.admin-nav-item.active { background: rgba(79,70,229,0.15); color: #818cf8; border-left: 2px solid #4f46e5; }
.admin-nav-item.mt-auto { margin-top: auto; }

/* Main */
.admin-main { flex: 1; padding: 2rem; overflow-y: auto; }

/* Stats */
.admin-stats {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem; margin-bottom: 2rem;
}
.admin-stat-card {
  background: #0f0f1e; border: 1px solid rgba(79,70,229,0.15);
  border-radius: 14px; padding: 1.5rem; text-align: center;
  transition: border-color 0.2s;
}
.admin-stat-card:hover { border-color: rgba(79,70,229,0.4); }
.admin-stat-icon { font-size: 1.8rem; color: #4f46e5; display: block; margin-bottom: 0.5rem; }
.admin-stat-value { font-size: 1.8rem; font-weight: 800; color: #f1f5f9; }
.admin-stat-label { font-size: 0.8rem; color: #64748b; margin-top: 0.2rem; }

/* Section */
.admin-section { background: #0f0f1e; border: 1px solid rgba(79,70,229,0.15); border-radius: 16px; padding: 1.5rem; }
.admin-section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.admin-section-header h3 { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin: 0; }
.badge-count { background: rgba(79,70,229,0.2); color: #818cf8; padding: 2px 10px; border-radius: 20px; font-size: 0.8rem; }

/* Table */
.admin-table-wrap { overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { color: #64748b; font-size: 0.8rem; font-weight: 600; padding: 0.75rem 1rem; border-bottom: 1px solid rgba(79,70,229,0.1); text-align: left; }
.admin-table td { padding: 0.85rem 1rem; border-bottom: 1px solid rgba(79,70,229,0.06); font-size: 0.9rem; color: #cbd5e1; }
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: rgba(79,70,229,0.04); }
.text-muted { color: #64748b !important; }

.user-name-cell { display: flex; align-items: center; gap: 0.6rem; }
.user-avatar { width: 32px; height: 32px; background: rgba(79,70,229,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #818cf8; flex-shrink: 0; }

.role-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.role-badge.admin { background: rgba(124,58,237,0.2); color: #c4b5fd; }
.role-badge.mentor { background: rgba(16,185,129,0.2); color: #6ee7b7; }
.role-badge.student { background: rgba(59,130,246,0.2); color: #93c5fd; }
.role-badge.visitor { background: rgba(100,116,139,0.2); color: #94a3b8; }

.status-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; }
.status-badge.active { background: rgba(16,185,129,0.1); color: #6ee7b7; }
.status-badge.blocked { background: rgba(239,68,68,0.1); color: #fca5a5; }

.payment-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; }
.payment-badge.paid { background: rgba(16,185,129,0.15); color: #6ee7b7; }
.payment-badge.pending { background: rgba(245,158,11,0.15); color: #fcd34d; }
.payment-badge.failed { background: rgba(239,68,68,0.15); color: #fca5a5; }
.payment-badge.refunded { background: rgba(100,116,139,0.15); color: #94a3b8; }

.action-btns { display: flex; gap: 0.4rem; }
.action-btn { width: 30px; height: 30px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; transition: opacity 0.2s; }
.action-btn:hover { opacity: 0.8; }
.action-btn.warn { background: rgba(245,158,11,0.15); color: #fcd34d; }
.action-btn.info { background: rgba(59,130,246,0.15); color: #93c5fd; }
.action-btn.danger { background: rgba(239,68,68,0.15); color: #fca5a5; }

/* Form */
.admin-form-wrap { max-width: 680px; }
.admin-form { display: flex; flex-direction: column; gap: 1.2rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.admin-field { display: flex; flex-direction: column; gap: 0.4rem; }
.admin-field label { font-size: 0.85rem; color: #94a3b8; }
.admin-field input, .admin-field select, .admin-field textarea {
  background: rgba(15,15,30,0.8); border: 1px solid rgba(79,70,229,0.2);
  border-radius: 10px; padding: 0.75rem 1rem;
  color: #f1f5f9; font-size: 0.9rem; outline: none;
  transition: border-color 0.2s;
}
.admin-field input:focus, .admin-field select:focus, .admin-field textarea:focus { border-color: #4f46e5; }
.admin-field select option { background: #0f0f1e; }
.admin-field textarea { resize: vertical; }

.upload-type-tabs { display: flex; gap: 0.5rem; }
.upload-tab { flex: 1; padding: 0.65rem; border: 1px solid rgba(79,70,229,0.2); background: transparent; color: #64748b; border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
.upload-tab.active { background: rgba(79,70,229,0.15); border-color: #4f46e5; color: #818cf8; }

.file-drop-zone {
  border: 2px dashed rgba(79,70,229,0.3); border-radius: 12px;
  padding: 2rem; text-align: center; cursor: pointer;
  transition: all 0.2s; color: #64748b;
}
.file-drop-zone:hover { border-color: #4f46e5; background: rgba(79,70,229,0.05); }
.selected-file { color: #e2e8f0; }

.upload-progress { margin-top: 0.5rem; background: rgba(79,70,229,0.1); border-radius: 6px; height: 8px; position: relative; }
.upload-progress-bar { height: 100%; background: linear-gradient(90deg,#4f46e5,#a855f7); border-radius: 6px; transition: width 0.3s; }
.upload-progress span { position: absolute; right: 0; top: -20px; font-size: 0.75rem; color: #818cf8; }

.admin-submit-btn {
  padding: 0.9rem 2rem; background: linear-gradient(135deg,#4f46e5,#7c3aed);
  border: none; border-radius: 10px; color: #fff;
  font-weight: 700; cursor: pointer; font-size: 0.95rem;
  transition: opacity 0.2s; align-self: flex-start;
}
.admin-submit-btn:hover:not(:disabled) { opacity: 0.9; }
.admin-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.admin-alert { padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.9rem; margin-bottom: 1rem; }
.admin-alert.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; }
.admin-alert.danger { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
</style>
