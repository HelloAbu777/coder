<template>
  <div class="admin-page">
    <!-- Modern Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="brand-logo">
          <div class="logo-icon">C</div>
          <span class="brand-text">CODERS</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="nav-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key">
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
          <div class="nav-indicator"></div>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" @click="logout">
          <i class="bi bi-box-arrow-left"></i>
          <span>Chiqish</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-content">
      <!-- Top Stats Cards -->
      <div class="stats-grid">
        <div v-for="stat in statsCards" :key="stat.label" class="stat-card">
          <div class="stat-icon" :class="stat.color">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Users Section -->
      <section v-if="activeTab === 'users'" class="content-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="bi bi-people-fill"></i>
              Foydalanuvchilar
            </h2>
            <p class="section-subtitle">{{ users.length }} ta foydalanuvchi</p>
          </div>
        </div>

        <div class="modern-table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>FOYDALANUVCHI</th>
                <th>USUL</th>
                <th>HOLAT</th>
                <th>SANA</th>
                <th>AMALLAR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">{{ user.name?.charAt(0) }}</div>
                    <div class="user-details">
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge-role" :class="user.role">{{ user.role }}</span>
                </td>
                <td>
                  <span class="badge-status" :class="user.isPaid ? 'paid' : 'unpaid'">
                    {{ user.isPaid ? 'paid' : 'test' }}
                  </span>
                </td>
                <td class="text-muted">{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn edit" title="Tahrirlash">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn delete" @click="deleteUser(user._id)" title="O'chirish">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Payments Section -->
      <section v-if="activeTab === 'payments'" class="content-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="bi bi-credit-card-fill"></i>
              To'lovlar
            </h2>
            <p class="section-subtitle">{{ payments.length }} ta to'lov</p>
          </div>
        </div>

        <div class="modern-table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>FOYDALANUVCHI</th>
                <th>SUMMA</th>
                <th>USUL</th>
                <th>HOLAT</th>
                <th>SANA</th>
                <th>AMALLAR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in payments" :key="payment._id">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">{{ payment.user?.name?.charAt(0) }}</div>
                    <div class="user-details">
                      <div class="user-name">{{ payment.user?.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="amount-cell">{{ formatMoney(payment.amount) }}</td>
                <td class="text-muted">{{ payment.method }}</td>
                <td>
                  <span class="badge-status" :class="payment.status">{{ payment.status }}</span>
                </td>
                <td class="text-muted">{{ formatDate(payment.paidAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button v-if="payment.status === 'paid'" class="action-btn delete" @click="refund(payment._id)">
                      Qaytarish
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Finance Section -->
      <section v-if="activeTab === 'finance'" class="content-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="bi bi-graph-up"></i>
              Moliya
            </h2>
            <p class="section-subtitle">Moliyaviy hisobot</p>
          </div>
        </div>

        <div class="finance-grid">
          <div class="finance-card green">
            <div class="fc-icon"><i class="bi bi-cash-stack"></i></div>
            <div class="fc-value">{{ formatMoney(finance.totalRevenue) }}</div>
            <div class="fc-label">Jami kirim</div>
          </div>
          <div class="finance-card blue">
            <div class="fc-icon"><i class="bi bi-calendar-check"></i></div>
            <div class="fc-value">{{ formatMoney(finance.thisMonthRevenue) }}</div>
            <div class="fc-label">Bu oy</div>
          </div>
          <div class="finance-card purple">
            <div class="fc-icon"><i class="bi bi-graph-up-arrow"></i></div>
            <div class="fc-value">{{ formatMoney(finance.netRevenue) }}</div>
            <div class="fc-label">Sof daromad</div>
          </div>
        </div>
      </section>

      <!-- Chat Section -->
      <section v-if="activeTab === 'chat'" class="content-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="bi bi-chat-dots-fill"></i>
              Chat
            </h2>
            <p class="section-subtitle">Chat boshqaruv</p>
          </div>
        </div>
        <div class="empty-state">
          <i class="bi bi-chat-square-dots"></i>
          <p>Chat funksiyasi tez orada</p>
        </div>
      </section>

      <!-- Videos Section -->
      <section v-if="activeTab === 'videos'" class="content-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="bi bi-play-circle-fill"></i>
              Video
            </h2>
            <p class="section-subtitle">Video qo'shish</p>
          </div>
        </div>
        <div class="empty-state">
          <i class="bi bi-play-circle"></i>
          <p>Video qo'shish funksiyasi</p>
        </div>
      </section>

      <!-- Tests Section -->
      <section v-if="activeTab === 'tests'" class="content-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="bi bi-patch-question-fill"></i>
              Testlar
            </h2>
            <p class="section-subtitle">Test boshqaruv</p>
          </div>
        </div>
        <div class="empty-state">
          <i class="bi bi-patch-question"></i>
          <p>Test boshqaruv funksiyasi</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/axios.js';

export default {
  name: 'AdminPage',
  setup() {
    const router = useRouter();
    const activeTab = ref('users');

    const tabs = [
      { key: 'users', label: 'Foydalanuvchilar', icon: 'bi bi-people-fill' },
      { key: 'payments', label: "To'lovlar", icon: 'bi bi-credit-card-fill' },
      { key: 'finance', label: 'Moliya', icon: 'bi bi-graph-up' },
      { key: 'chat', label: 'Chat', icon: 'bi bi-chat-dots-fill' },
      { key: 'videos', label: 'Video', icon: 'bi bi-play-circle-fill' },
      { key: 'tests', label: 'Testlar', icon: 'bi bi-patch-question-fill' }
    ];

    const statsCards = ref([]);
    const users = ref([]);
    const payments = ref([]);
    const finance = ref({});

    const formatDate = (date) => {
      if (!date) return '—';
      return new Date(date).toLocaleDateString('uz-UZ');
    };

    const formatMoney = (amount) => {
      if (!amount) return '0 so\'m';
      return `${Number(amount).toLocaleString('uz-UZ')} so'm`;
    };

    const loadData = async () => {
      try {
        const [statsRes, usersRes, paymentsRes, financeRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/payments'),
          api.get('/admin/finance')
        ]);

        const stats = statsRes.data;
        statsCards.value = [
          { icon: 'bi bi-people-fill', value: stats.totalUsers, label: "O'quvchilar", color: 'blue' },
          { icon: 'bi bi-credit-card-fill', value: stats.totalPaid, label: "To'langan", color: 'green' },
          { icon: 'bi bi-cash-stack', value: `${(stats.totalRevenue / 1000000).toFixed(1)}M so'm`, label: 'Daromad', color: 'purple' },
          { icon: 'bi bi-play-circle-fill', value: stats.totalVideos, label: 'Videolar', color: 'orange' }
        ];

        users.value = usersRes.data;
        payments.value = paymentsRes.data;
        finance.value = financeRes.data;
      } catch (err) {
        console.error('Ma\'lumot yuklashda xato:', err);
      }
    };

    const deleteUser = async (id) => {
      if (!confirm('Foydalanuvchini o\'chirasizmi?')) return;
      try {
        await api.delete(`/admin/users/${id}`);
        users.value = users.value.filter(u => u._id !== id);
      } catch (err) {
        alert('Xato yuz berdi');
      }
    };

    const refund = async (id) => {
      if (!confirm('To\'lovni qaytarasizmi?')) return;
      try {
        await api.post(`/admin/payments/${id}/refund`);
        await loadData();
      } catch (err) {
        alert('Xato yuz berdi');
      }
    };

    const logout = () => {
      localStorage.clear();
      router.push('/login');
    };

    onMounted(() => {
      loadData();
    });

    return {
      activeTab,
      tabs,
      statsCards,
      users,
      payments,
      finance,
      formatDate,
      formatMoney,
      deleteUser,
      refund,
      logout
    };
  }
};
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
  background: #0a0a14;
}

/* ===== Sidebar ===== */
.admin-sidebar {
  width: 260px;
  background: #13131f;
  border-right: 1px solid rgba(99, 102, 241, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  color: white;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.nav-item i {
  font-size: 1.125rem;
  width: 20px;
}

.nav-item:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #a5b4fc;
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
}

.nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: #6366f1;
  border-radius: 0 3px 3px 0;
  transition: height 0.2s;
}

.nav-item.active .nav-indicator {
  height: 70%;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.logout-btn {
  color: #ef4444;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

/* ===== Main Content ===== */
.admin-content {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  overflow-y: auto;
}

/* ===== Stats Grid ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-icon.green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #a855f7, #9333ea);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1;
  margin-bottom: 0.375rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== Content Section ===== */
.content-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #6366f1;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

/* ===== Modern Table ===== */
.modern-table-container {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

.modern-table thead th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modern-table tbody tr {
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.2s;
}

.modern-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: scale(1.01);
}

.modern-table tbody td {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modern-table tbody td:first-child {
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px 0 0 10px;
}

.modern-table tbody td:last-child {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0 10px 10px 0;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #f1f5f9;
  font-size: 0.9375rem;
  margin-bottom: 0.125rem;
}

.user-email {
  font-size: 0.8125rem;
  color: #64748b;
}

.badge-role {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.badge-role.student {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.badge-role.mentor {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.badge-role.admin {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.badge-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.badge-status.paid {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.badge-status.unpaid {
  background: rgba(100, 116, 139, 0.15);
  color: #94a3b8;
}

.text-muted {
  color: #64748b;
  font-size: 0.875rem;
}

.amount-cell {
  font-weight: 700;
  color: #10b981;
  font-size: 0.9375rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.action-btn.edit:hover {
  background: rgba(59, 130, 246, 0.25);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.25);
}

/* ===== Finance Grid ===== */
.finance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.finance-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.finance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.finance-card.green {
  border-color: rgba(16, 185, 129, 0.3);
}

.finance-card.blue {
  border-color: rgba(59, 130, 246, 0.3);
}

.finance-card.purple {
  border-color: rgba(168, 85, 247, 0.3);
}

.fc-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.finance-card.green .fc-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.finance-card.blue .fc-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.finance-card.purple .fc-icon {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.fc-value {
  font-size: 2rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}

.fc-label {
  font-size: 0.9375rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.125rem;
  margin: 0;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 220px;
  }

  .admin-content {
    margin-left: 220px;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 70px;
  }

  .admin-content {
    margin-left: 70px;
    padding: 1rem;
  }

  .brand-text,
  .nav-item span {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
