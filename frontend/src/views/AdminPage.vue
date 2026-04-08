<template>
  <div class="container py-5">
    <h2 class="section-title mb-5">Admin Panel</h2>

    <!-- Statistika -->
    <div class="row g-4 mb-5">
      <div v-for="s in statsCards" :key="s.label" class="col-md-3">
        <div class="card-dark p-4 text-center">
          <i :class="s.icon" class="fs-2 mb-2 d-block" style="color:var(--primary)"></i>
          <div class="fw-bold fs-4" style="color:var(--text-light)">{{ s.value }}</div>
          <div class="small" style="color:var(--text-muted)">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- Tablar -->
    <div class="d-flex gap-2 flex-wrap mb-4">
      <button v-for="t in tabs" :key="t" class="btn btn-sm"
        :class="activeTab === t ? 'btn-primary' : 'btn-outline-secondary'"
        @click="activeTab = t">{{ t }}</button>
    </div>

    <!-- Foydalanuvchilar -->
    <div v-if="activeTab === 'Foydalanuvchilar'" class="card-dark">
      <div class="table-responsive">
        <table class="table table-dark mb-0" style="border-color:var(--border)">
          <thead style="border-color:var(--border)">
            <tr>
              <th style="color:var(--text-muted)">Ism</th>
              <th style="color:var(--text-muted)">Email</th>
              <th style="color:var(--text-muted)">Rol</th>
              <th style="color:var(--text-muted)">Daraja</th>
              <th style="color:var(--text-muted)">To'lov</th>
              <th style="color:var(--text-muted)">Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u._id" style="border-color:var(--border)">
              <td style="color:var(--text-light)">{{ u.name }}</td>
              <td style="color:var(--text-muted)">{{ u.email }}</td>
              <td>
                <span class="badge" :style="roleBadge(u.role)">{{ u.role }}</span>
              </td>
              <td style="color:var(--text-light)">{{ u.level }}</td>
              <td>
                <i v-if="u.isPaid" class="bi bi-check-circle-fill" style="color:var(--success)"></i>
                <i v-else class="bi bi-x-circle" style="color:var(--danger)"></i>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-warning" @click="toggleBlock(u)">
                    {{ u.isBlocked ? 'Blok ochish' : 'Bloklash' }}
                  </button>
                  <button v-if="u.role !== 'mentor'" class="btn btn-sm btn-outline-info" @click="makeMentor(u._id)">
                    Mentor
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteUser(u._id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- To'lovlar -->
    <div v-if="activeTab === 'To\'lovlar'" class="card-dark">
      <div class="table-responsive">
        <table class="table table-dark mb-0" style="border-color:var(--border)">
          <thead>
            <tr>
              <th style="color:var(--text-muted)">Foydalanuvchi</th>
              <th style="color:var(--text-muted)">Summa</th>
              <th style="color:var(--text-muted)">Usul</th>
              <th style="color:var(--text-muted)">Holat</th>
              <th style="color:var(--text-muted)">Sana</th>
              <th style="color:var(--text-muted)">Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in payments" :key="p._id" style="border-color:var(--border)">
              <td style="color:var(--text-light)">{{ p.user?.name }}</td>
              <td style="color:var(--text-light)">{{ p.amount?.toLocaleString() }} so'm</td>
              <td style="color:var(--text-muted)">{{ p.method }}</td>
              <td>
                <span class="badge" :style="paymentBadge(p.status)">{{ p.status }}</span>
              </td>
              <td style="color:var(--text-muted)">{{ p.paidAt ? new Date(p.paidAt).toLocaleDateString('uz-UZ') : '—' }}</td>
              <td>
                <button v-if="p.status === 'paid'" class="btn btn-sm btn-outline-danger" @click="refund(p._id)">
                  Qaytarish
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Video qo'shish -->
    <div v-if="activeTab === 'Video qo\'shish'" class="card-dark p-4" style="max-width:600px">
      <h5 class="fw-semibold mb-4" style="color:var(--text-light)">Yangi video qo'shish</h5>
      <div v-if="videoSuccess" class="alert-dark-success p-3 mb-4 small">Video muvaffaqiyatli qo'shildi!</div>
      <form @submit.prevent="addVideo">
        <div class="mb-3">
          <label class="form-label small" style="color:var(--text-muted)">Sarlavha</label>
          <input v-model="videoForm.title" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label small" style="color:var(--text-muted)">URL (YouTube yoki to'g'ridan)</label>
          <input v-model="videoForm.url" type="url" class="form-control" required />
        </div>
        <div class="row g-3 mb-3">
          <div class="col">
            <label class="form-label small" style="color:var(--text-muted)">Bo'lim</label>
            <select v-model="videoForm.section" class="form-select" required>
              <option v-for="s in sectionList" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="col">
            <label class="form-label small" style="color:var(--text-muted)">Tartib raqam</label>
            <input v-model.number="videoForm.order" type="number" class="form-control" min="1" required />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label small" style="color:var(--text-muted)">Tavsif</label>
          <textarea v-model="videoForm.description" class="form-control" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="videoLoading">
          <span v-if="videoLoading" class="spinner-border spinner-border-sm me-2"></span>
          Qo'shish
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import api from '../utils/axios.js';

export default {
  name: 'AdminPage',
  setup() {
    const activeTab = ref('Foydalanuvchilar');
    const tabs = ['Foydalanuvchilar', 'To\'lovlar', 'Video qo\'shish'];
    const users = ref([]);
    const payments = ref([]);
    const statsCards = ref([]);
    const sectionList = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'];
    const videoLoading = ref(false);
    const videoSuccess = ref(false);
    const videoForm = reactive({ title: '', url: '', section: 'HTML', order: 1, description: '' });

    const roleBadge = (role) => {
      const map = { admin: 'background:#7c3aed;color:#fff', mentor: 'background:#065f46;color:#6ee7b7', student: 'background:#1e3a5f;color:#93c5fd', visitor: 'background:#374151;color:#9ca3af' };
      return map[role] || '';
    };

    const paymentBadge = (status) => {
      const map = { paid: 'background:rgba(16,185,129,0.2);color:#6ee7b7', pending: 'background:rgba(245,158,11,0.2);color:#fcd34d', failed: 'background:rgba(239,68,68,0.2);color:#fca5a5', refunded: 'background:rgba(148,163,184,0.2);color:#cbd5e1' };
      return map[status] || '';
    };

    const loadData = async () => {
      try {
        const [statsRes, usersRes, paymentsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/payments')
        ]);
        const s = statsRes.data;
        statsCards.value = [
          { icon: 'bi bi-people', value: s.totalUsers, label: 'O\'quvchilar' },
          { icon: 'bi bi-credit-card', value: s.totalPaid, label: 'To\'langan' },
          { icon: 'bi bi-cash-stack', value: `${(s.totalRevenue / 1000).toFixed(0)}K`, label: 'Daromad (so\'m)' },
          { icon: 'bi bi-play-circle', value: s.totalVideos, label: 'Videolar' }
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
      if (!confirm('Foydalanuvchini o\'chirasizmi?')) return;
      try {
        await api.delete(`/admin/users/${id}`);
        users.value = users.value.filter((u) => u._id !== id);
      } catch (_) {}
    };

    const refund = async (id) => {
      if (!confirm('To\'lovni qaytarasizmi?')) return;
      try {
        await api.put(`/admin/payments/${id}/refund`);
        const p = payments.value.find((x) => x._id === id);
        if (p) p.status = 'refunded';
      } catch (_) {}
    };

    const addVideo = async () => {
      videoLoading.value = true;
      videoSuccess.value = false;
      try {
        await api.post('/videos', videoForm);
        videoSuccess.value = true;
        Object.assign(videoForm, { title: '', url: '', section: 'HTML', order: 1, description: '' });
      } catch (_) {} finally {
        videoLoading.value = false;
      }
    };

    onMounted(loadData);

    return { activeTab, tabs, users, payments, statsCards, sectionList, videoLoading, videoSuccess, videoForm, roleBadge, paymentBadge, toggleBlock, makeMentor, deleteUser, refund, addVideo };
  }
};
</script>
