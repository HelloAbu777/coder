<template>
  <div class="admin-layout">
    <!-- Chap sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-brand">CODERS</div>
      <nav class="admin-nav">
        <button v-for="t in tabs" :key="t.key"
          class="admin-nav-item"
          :class="{ active: activeTab === t.key }"
          @click="onTabChange(t.key)">
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

      <!-- ======================== FOYDALANUVCHILAR ======================== -->
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
                    <div>
                      <div>{{ u.name }}</div>
                      <div style="font-size:0.72rem;color:#64748b">@{{ u.username }}</div>
                    </div>
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
                    <button class="action-btn warn" @click="toggleBlock(u)" :title="u.isBlocked ? 'Blokdan chiqarish' : 'Bloklash'">
                      <i :class="u.isBlocked ? 'bi bi-unlock' : 'bi bi-lock'"></i>
                    </button>
                    <select class="role-select" :value="u.role" @change="changeUserRole(u, $event.target.value)" title="Rol o'zgartirish">
                      <option value="visitor">visitor</option>
                      <option value="student">student</option>
                      <option value="mentor">mentor</option>
                    </select>
                    <button class="action-btn danger" @click="deleteUser(u._id)" title="O'chirish">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ======================== TO'LOVLAR ======================== -->
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

      <!-- ======================== MOLIYA ======================== -->
      <section v-if="activeTab === 'finance'" class="admin-section">
        <div class="admin-section-header">
          <h3>Moliyaviy hisobot</h3>
        </div>

        <div v-if="financeLoading" class="text-center py-5" style="color:#64748b">
          <div class="spinner-border mb-2" style="color:#4f46e5"></div>
          <div>Yuklanmoqda...</div>
        </div>

        <div v-else>
          <!-- Finance cards -->
          <div class="finance-cards">
            <div class="finance-card green">
              <div class="fc-icon"><i class="bi bi-cash-stack"></i></div>
              <div class="fc-val">{{ formatMoney(finance.totalRevenue) }}</div>
              <div class="fc-lbl">Jami kirim</div>
              <div class="fc-sub">{{ finance.totalPaidCount }} ta to'lov</div>
            </div>
            <div class="finance-card blue">
              <div class="fc-icon"><i class="bi bi-calendar-check"></i></div>
              <div class="fc-val">{{ formatMoney(finance.thisMonthRevenue) }}</div>
              <div class="fc-lbl">Bu oy</div>
              <div class="fc-sub">{{ finance.thisMonthCount }} ta yangi</div>
            </div>
            <div class="finance-card yellow">
              <div class="fc-icon"><i class="bi bi-calendar-minus"></i></div>
              <div class="fc-val">{{ formatMoney(finance.lastMonthRevenue) }}</div>
              <div class="fc-lbl">O'tgan oy</div>
              <div class="fc-sub">solishtirish uchun</div>
            </div>
            <div class="finance-card red">
              <div class="fc-icon"><i class="bi bi-arrow-counterclockwise"></i></div>
              <div class="fc-val">{{ formatMoney(finance.refundTotal) }}</div>
              <div class="fc-lbl">Qaytarilgan</div>
              <div class="fc-sub">{{ finance.refundCount }} ta</div>
            </div>
            <div class="finance-card purple">
              <div class="fc-icon"><i class="bi bi-graph-up-arrow"></i></div>
              <div class="fc-val">{{ formatMoney(finance.netRevenue) }}</div>
              <div class="fc-lbl">Sof daromad</div>
              <div class="fc-sub">kirim − qaytarilgan</div>
            </div>
          </div>

          <!-- Oylik jadval -->
          <div class="finance-chart-wrap mt-4">
            <h5 class="fw-semibold mb-4" style="color:#f1f5f9">
              <i class="bi bi-bar-chart me-2" style="color:#4f46e5"></i>Oylik kirim
            </h5>
            <div v-if="finance.monthly?.length === 0" class="text-center py-4" style="color:#64748b">
              Hali to'lov yo'q
            </div>
            <div v-else>
              <!-- Bar chart -->
              <div class="bar-chart">
                <div v-for="m in finance.monthly" :key="m.label" class="bar-item">
                  <div class="bar-wrap">
                    <div
                      class="bar-fill"
                      :style="`height: ${maxMonthly > 0 ? Math.round((m.total / maxMonthly) * 100) : 0}%`"
                      :title="`${m.label}: ${formatMoney(m.total)}`">
                    </div>
                  </div>
                  <div class="bar-val">{{ formatMoneyShort(m.total) }}</div>
                  <div class="bar-lbl">{{ m.label }}</div>
                </div>
              </div>

              <!-- Jadval -->
              <table class="admin-table mt-4">
                <thead>
                  <tr>
                    <th>Oy</th>
                    <th>To'lovlar soni</th>
                    <th>Summa</th>
                    <th>O'sish</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in [...finance.monthly].reverse()" :key="m.label">
                    <td class="fw-semibold" style="color:#f1f5f9">{{ m.label }}</td>
                    <td>{{ m.count }} ta</td>
                    <td style="color:#10b981;font-weight:700">{{ formatMoney(m.total) }}</td>
                    <td>
                      <span v-if="i < finance.monthly.length - 1">
                        <span v-if="m.total > finance.monthly[finance.monthly.length - 2 - i]?.total" style="color:#10b981">
                          <i class="bi bi-arrow-up"></i>
                          +{{ Math.round(((m.total - finance.monthly[finance.monthly.length - 2 - i].total) / finance.monthly[finance.monthly.length - 2 - i].total) * 100) }}%
                        </span>
                        <span v-else-if="m.total < finance.monthly[finance.monthly.length - 2 - i]?.total" style="color:#ef4444">
                          <i class="bi bi-arrow-down"></i>
                        </span>
                        <span v-else style="color:#64748b">—</span>
                      </span>
                      <span v-else style="color:#64748b">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================== CHAT BOSHQARUV ======================== -->
      <section v-if="activeTab === 'chat'" class="admin-section">
        <div class="admin-section-header">
          <h3>Chat boshqaruv</h3>
          <span class="badge-count">{{ chatRooms.length }} xona</span>
        </div>

        <div class="chat-admin-layout">
          <!-- Xonalar ro'yxati -->
          <div class="chat-rooms-list">
            <div
              v-for="room in chatRooms" :key="room._id"
              class="chat-room-item"
              :class="{ active: selectedRoom === room._id }"
              @click="selectChatRoom(room._id)">
              <div class="room-icon">
                <i v-if="room._id === 'general'" class="bi bi-people-fill"></i>
                <i v-else class="bi bi-person-fill"></i>
              </div>
              <div class="room-info">
                <div class="room-name">{{ formatRoomName(room._id) }}</div>
                <div class="room-meta">{{ room.count }} xabar</div>
              </div>
              <button class="clear-room-btn" @click.stop="clearRoom(room._id)" title="Xonani tozalash">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>

            <div v-if="chatRooms.length === 0" class="empty-rooms">
              <i class="bi bi-chat-slash"></i>
              <p>Xonalar yo'q</p>
            </div>
          </div>

          <!-- Xabarlar -->
          <div class="chat-messages-panel">
            <div v-if="!selectedRoom" class="msg-empty">
              <i class="bi bi-chat-square-dots"></i>
              <p>Xona tanlang</p>
            </div>

            <div v-else>
              <div class="msg-panel-header">
                <span class="fw-semibold" style="color:#f1f5f9">{{ formatRoomName(selectedRoom) }}</span>
                <button class="danger-clear-btn" @click="clearRoom(selectedRoom)">
                  <i class="bi bi-trash3 me-1"></i>Xonani to'liq tozalash
                </button>
              </div>

              <div class="msg-list" ref="msgListEl">
                <div v-if="chatMessages.length === 0" class="msg-empty-inner">
                  <i class="bi bi-chat-dots"></i>
                  <p>Xabar yo'q</p>
                </div>
                <div v-for="msg in chatMessages" :key="msg._id" class="msg-row">
                  <div class="msg-sender-avatar">{{ msg.sender?.name?.charAt(0)?.toUpperCase() }}</div>
                  <div class="msg-body">
                    <div class="msg-meta">
                      <span class="msg-sender">{{ msg.sender?.name }}</span>
                      <span v-if="msg.sender?.username" class="msg-username">@{{ msg.sender.username }}</span>
                      <span class="msg-role-badge" :class="msg.sender?.role">{{ msg.sender?.role }}</span>
                      <span class="msg-time">{{ formatMsgTime(msg.createdAt) }}</span>
                    </div>
                    <div class="msg-content">{{ msg.content }}</div>
                  </div>
                  <button class="msg-del-btn" @click="deleteAdminMsg(msg._id)" title="O'chirish">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================== TESTLAR ======================== -->
      <section v-if="activeTab === 'quizzes'" class="admin-section">
        <div class="admin-section-header">
          <h3>Testlar boshqaruvi</h3>
          <span class="badge-count">{{ quizzes.length }} ta</span>
          <button class="btn-add-quiz ms-auto" @click="showQuizForm = !showQuizForm">
            <i class="bi bi-plus-circle me-2"></i>Yangi test
          </button>
        </div>

        <!-- Yangi test formasi -->
        <div v-if="showQuizForm" class="quiz-form-wrap">
          <div v-if="quizSuccess" class="admin-alert success mb-3">
            <i class="bi bi-check-circle me-2"></i>Test muvaffaqiyatli saqlandi!
          </div>
          <div v-if="quizError" class="admin-alert danger mb-3">
            <i class="bi bi-exclamation-circle me-2"></i>{{ quizError }}
          </div>

          <div class="form-row mb-3">
            <div class="admin-field">
              <label>Test sarlavhasi</label>
              <input v-model="quizForm.title" type="text" placeholder="Masalan: HTML Kirish testi" required />
            </div>
            <div class="admin-field">
              <label>Bo'lim</label>
              <select v-model="quizForm.section">
                <option v-for="s in sectionList" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <div class="admin-field mb-4">
            <label>Video (ixtiyoriy — bog'lash uchun)</label>
            <select v-model="quizForm.video">
              <option value="">— Videosiz (mustaqil test) —</option>
              <option v-for="v in allVideosForQuiz.filter(v => v.section === quizForm.section)" :key="v._id" :value="v._id">
                {{ v.order }}. {{ v.title }}
              </option>
            </select>
            <span class="field-hint">Video tanlansa, o'quvchi videoni ko'rgandan so'ng test ochiladi</span>
          </div>

          <!-- Savollar -->
          <div class="questions-list">
            <div v-for="(q, qi) in quizForm.questions" :key="qi" class="question-edit-card">
              <div class="qe-header">
                <span class="qe-num">Savol {{ qi + 1 }}</span>
                <button v-if="quizForm.questions.length > 1" class="qe-remove" @click="removeQuestion(qi)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <input v-model="q.question" type="text" placeholder="Savol matni..." class="qe-input mb-2" />
              <div class="qe-options">
                <div v-for="(opt, oi) in q.options" :key="oi" class="qe-option-row">
                  <input
                    type="radio"
                    :name="`correct-${qi}`"
                    :value="oi"
                    v-model="q.correctIndex"
                    class="qe-radio"
                    :title="'To\'g\'ri javob'"
                  />
                  <input v-model="q.options[oi]" type="text" :placeholder="`Variant ${String.fromCharCode(65+oi)}`" class="qe-opt-input" />
                </div>
              </div>
              <p class="qe-hint">Radio tugmasini bosing — to'g'ri javob belgilanadi</p>
            </div>
          </div>

          <div class="d-flex gap-2 mt-3">
            <button class="btn-add-q" @click="addQuestion">
              <i class="bi bi-plus me-2"></i>Savol qo'shish
            </button>
            <button class="admin-submit-btn" @click="saveQuiz" style="flex:1">
              <i class="bi bi-floppy me-2"></i>Saqlash
            </button>
          </div>
        </div>

        <!-- Mavjud testlar ro'yxati -->
        <div v-if="quizLoading" class="text-center py-4" style="color:#64748b">
          <div class="spinner-border spinner-border-sm"></div>
        </div>
        <div v-else-if="quizzes.length === 0 && !showQuizForm" class="text-center py-5" style="color:#64748b">
          <i class="bi bi-patch-question fs-2 d-block mb-2"></i>
          <p>Hali test yo'q. "Yangi test" tugmasini bosing</p>
        </div>
        <div v-else class="admin-table-wrap mt-3">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Sarlavha</th>
                <th>Bo'lim</th>
                <th>Savollar</th>
                <th>Video</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in quizzes" :key="q._id">
                <td style="color:#f1f5f9;font-weight:600">{{ q.title }}</td>
                <td><span class="role-badge student">{{ q.section }}</span></td>
                <td>{{ q.questions?.length || 0 }} ta</td>
                <td>
                  <span v-if="q.video" style="color:#10b981;font-size:0.82rem">
                    <i class="bi bi-link-45deg"></i> Bog'langan
                  </span>
                  <span v-else style="color:#64748b;font-size:0.82rem">—</span>
                </td>
                <td>
                  <button class="action-btn danger" @click="deleteQuiz(q._id)" title="O'chirish">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ======================== VIDEO QO'SHISH ======================== -->
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

            <div class="upload-type-tabs">
              <button type="button" class="upload-tab" :class="{ active: uploadType === 'youtube' }" @click="uploadType = 'youtube'">
                <i class="bi bi-youtube me-2"></i>YouTube
              </button>
              <button type="button" class="upload-tab" :class="{ active: uploadType === 'file' }" @click="uploadType = 'file'">
                <i class="bi bi-upload me-2"></i>Kompyuterdan
              </button>
            </div>

            <div v-if="uploadType === 'youtube'" class="admin-field">
              <label>YouTube URL</label>
              <input v-model="videoForm.url" type="url" placeholder="https://youtube.com/watch?v=..." />
            </div>

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
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
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
      { key: 'finance', label: 'Moliya', icon: 'bi bi-graph-up' },
      { key: 'chat', label: 'Chat', icon: 'bi bi-chat-dots' },
      { key: 'videos', label: 'Video', icon: 'bi bi-play-circle' },
      { key: 'quizzes', label: 'Testlar', icon: 'bi bi-patch-question' }
    ];

    // Users & payments
    const users = ref([]);
    const payments = ref([]);
    const statsCards = ref([]);

    // Finance
    const finance = ref({});
    const financeLoading = ref(false);
    const maxMonthly = computed(() =>
      Math.max(...(finance.value.monthly?.map((m) => m.total) || [1]))
    );

    // Chat
    const chatRooms = ref([]);
    const chatMessages = ref([]);
    const selectedRoom = ref(null);
    const msgListEl = ref(null);

    // Quiz
    const quizzes = ref([]);
    const allVideosForQuiz = ref([]);
    const quizLoading = ref(false);
    const quizSuccess = ref(false);
    const quizError = ref('');
    const showQuizForm = ref(false);
    const quizForm = reactive({
      title: '', section: 'HTML', video: '',
      questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0 }]
    });

    const addQuestion = () => {
      quizForm.questions.push({ question: '', options: ['', '', '', ''], correctIndex: 0 });
    };
    const removeQuestion = (i) => {
      if (quizForm.questions.length > 1) quizForm.questions.splice(i, 1);
    };

    const loadQuizzes = async () => {
      quizLoading.value = true;
      try {
        const [qRes, vRes] = await Promise.all([
          api.get('/admin/quizzes'),
          api.get('/videos')
        ]);
        quizzes.value = qRes.data;
        allVideosForQuiz.value = vRes.data;
      } catch (_) {} finally {
        quizLoading.value = false;
      }
    };

    const saveQuiz = async () => {
      quizError.value = '';
      quizSuccess.value = false;
      // Validation
      for (const q of quizForm.questions) {
        if (!q.question.trim()) { quizError.value = 'Barcha savollarni to\'ldiring'; return; }
        if (q.options.some((o) => !o.trim())) { quizError.value = 'Barcha variantlarni to\'ldiring'; return; }
      }
      try {
        const payload = {
          title: quizForm.title,
          section: quizForm.section,
          video: quizForm.video || undefined,
          questions: quizForm.questions
        };
        await api.post('/quiz', payload);
        quizSuccess.value = true;
        showQuizForm.value = false;
        Object.assign(quizForm, { title: '', section: 'HTML', video: '', questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0 }] });
        await loadQuizzes();
      } catch (err) {
        quizError.value = err.response?.data?.message || 'Xato yuz berdi';
      }
    };

    const deleteQuiz = async (id) => {
      if (!confirm('Testni o\'chirasizmi?')) return;
      try {
        await api.delete(`/quiz/${id}`);
        quizzes.value = quizzes.value.filter((q) => q._id !== id);
      } catch (_) {}
    };

    // Video
    const sectionList = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'];
    const videoLoading = ref(false);
    const videoSuccess = ref(false);
    const videoError = ref('');
    const uploadType = ref('youtube');
    const selectedFile = ref(null);
    const uploadProgress = ref(0);
    const fileInput = ref(null);
    const videoForm = reactive({ title: '', url: '', section: 'HTML', order: 1, description: '', duration: 0 });

    // ---- Load ----
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
          { icon: 'bi bi-cash-stack', value: `${(s.totalRevenue / 1000000).toFixed(1)}M so'm`, label: 'Daromad' },
          { icon: 'bi bi-play-circle-fill', value: s.totalVideos, label: 'Videolar' }
        ];
        users.value = usersRes.data;
        payments.value = paymentsRes.data;
      } catch (_) {}
    };

    const loadFinance = async () => {
      financeLoading.value = true;
      try {
        const { data } = await api.get('/admin/finance');
        finance.value = data;
      } catch (_) {} finally {
        financeLoading.value = false;
      }
    };

    const loadChatRooms = async () => {
      try {
        const { data } = await api.get('/admin/chat/rooms');
        chatRooms.value = data;
      } catch (_) {}
    };

    const selectChatRoom = async (roomId) => {
      selectedRoom.value = roomId;
      try {
        const { data } = await api.get(`/admin/chat/${roomId}/messages`);
        chatMessages.value = data;
        await nextTick();
        if (msgListEl.value) msgListEl.value.scrollTop = msgListEl.value.scrollHeight;
      } catch (_) {}
    };

    // ---- Finance ----
    const formatMoney = (val) => {
      if (!val) return '0 so\'m';
      return `${Number(val).toLocaleString('uz-UZ')} so'm`;
    };
    const formatMoneyShort = (val) => {
      if (!val) return '0';
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
      return String(val);
    };

    // ---- Chat ----
    const formatRoomName = (roomId) => {
      if (roomId === 'general') return 'Umumiy chat';
      if (roomId?.startsWith('private-')) return `Shaxsiy: ${roomId.replace('private-', '').slice(0, 8)}...`;
      return roomId;
    };

    const formatMsgTime = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const clearRoom = async (roomId) => {
      if (!confirm(`"${formatRoomName(roomId)}" xonasidagi barcha xabarlar o'chiriladi. Davom etasizmi?`)) return;
      try {
        await api.delete(`/admin/chat/${roomId}/clear`);
        chatMessages.value = [];
        const room = chatRooms.value.find((r) => r._id === roomId);
        if (room) room.count = 0;
      } catch (_) {}
    };

    const deleteAdminMsg = async (id) => {
      try {
        await api.delete(`/admin/chat/message/${id}`);
        chatMessages.value = chatMessages.value.filter((m) => m._id !== id);
        const room = chatRooms.value.find((r) => r._id === selectedRoom.value);
        if (room && room.count > 0) room.count--;
      } catch (_) {}
    };

    // ---- Users ----
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

    const changeUserRole = async (u, role) => {
      if (u.role === role) return;
      try {
        await api.put(`/admin/users/${u._id}/role`, { role });
        u.role = role;
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

    // ---- Video ----
    const onFileChange = (e) => { selectedFile.value = e.target.files[0] || null; };
    const onDrop = (e) => { selectedFile.value = e.dataTransfer.files[0] || null; };

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
            onUploadProgress: (e) => { uploadProgress.value = Math.round((e.loaded / e.total) * 100); }
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

    const onTabChange = (key) => {
      activeTab.value = key;
      if (key === 'finance' && !finance.value.totalRevenue) loadFinance();
      if (key === 'chat' && chatRooms.value.length === 0) loadChatRooms();
      if (key === 'quizzes' && quizzes.value.length === 0) loadQuizzes();
    };

    onMounted(loadData);

    return {
      activeTab, tabs, users, payments, statsCards,
      finance, financeLoading, maxMonthly,
      chatRooms, chatMessages, selectedRoom, msgListEl,
      sectionList, videoLoading, videoSuccess, videoError,
      uploadType, selectedFile, uploadProgress, fileInput, videoForm,
      quizzes, allVideosForQuiz, quizLoading, quizSuccess, quizError,
      showQuizForm, quizForm, addQuestion, removeQuestion, saveQuiz, deleteQuiz,
      formatMoney, formatMoneyShort, formatRoomName, formatMsgTime,
      loadFinance, loadChatRooms, selectChatRoom, clearRoom, deleteAdminMsg,
      toggleBlock, makeMentor, changeUserRole, deleteUser, refund,
      onFileChange, onDrop, addVideo, logout, onTabChange
    };
  }
};
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: #0a0a14; color: #e2e8f0; }

/* Sidebar */
.admin-sidebar { width: 240px; flex-shrink: 0; background: #0f0f1e; border-right: 1px solid rgba(79,70,229,0.15); display: flex; flex-direction: column; padding: 1.5rem 1rem; position: sticky; top: 0; height: 100vh; }
.admin-brand { font-size: 1.4rem; font-weight: 900; letter-spacing: 2px; background: linear-gradient(135deg,#4f46e5,#a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 0 0.5rem; margin-bottom: 2rem; }
.admin-nav { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
.admin-nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 10px; border: none; background: transparent; color: #64748b; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; text-decoration: none; width: 100%; }
.admin-nav-item:hover { background: rgba(79,70,229,0.1); color: #a5b4fc; }
.admin-nav-item.active { background: rgba(79,70,229,0.15); color: #818cf8; border-left: 2px solid #4f46e5; }
.admin-nav-item.mt-auto { margin-top: auto; }

/* Main */
.admin-main { flex: 1; padding: 2rem; overflow-y: auto; }

/* Stats */
.admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.admin-stat-card { background: #0f0f1e; border: 1px solid rgba(79,70,229,0.15); border-radius: 14px; padding: 1.5rem; text-align: center; transition: border-color 0.2s; }
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

.action-btns { display: flex; gap: 0.4rem; align-items: center; }
.role-select { background: rgba(79,70,229,0.12); border: 1px solid rgba(79,70,229,0.25); border-radius: 8px; color: #a5b4fc; font-size: 0.75rem; padding: 3px 6px; cursor: pointer; outline: none; height: 30px; }
.role-select:focus { border-color: #4f46e5; }
.action-btn { width: 30px; height: 30px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; transition: opacity 0.2s; }
.action-btn:hover { opacity: 0.8; }
.action-btn.warn { background: rgba(245,158,11,0.15); color: #fcd34d; }
.action-btn.danger { background: rgba(239,68,68,0.15); color: #fca5a5; }

/* ===== FINANCE ===== */
.finance-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
.finance-card { border-radius: 14px; padding: 1.25rem; border: 1px solid transparent; }
.finance-card.green { background: rgba(16,185,129,0.07); border-color: rgba(16,185,129,0.2); }
.finance-card.blue { background: rgba(59,130,246,0.07); border-color: rgba(59,130,246,0.2); }
.finance-card.yellow { background: rgba(245,158,11,0.07); border-color: rgba(245,158,11,0.2); }
.finance-card.red { background: rgba(239,68,68,0.07); border-color: rgba(239,68,68,0.2); }
.finance-card.purple { background: rgba(124,58,237,0.07); border-color: rgba(124,58,237,0.2); }
.fc-icon { font-size: 1.4rem; margin-bottom: 0.6rem; }
.finance-card.green .fc-icon { color: #10b981; }
.finance-card.blue .fc-icon { color: #3b82f6; }
.finance-card.yellow .fc-icon { color: #f59e0b; }
.finance-card.red .fc-icon { color: #ef4444; }
.finance-card.purple .fc-icon { color: #7c3aed; }
.fc-val { font-size: 1.2rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.2rem; }
.fc-lbl { font-size: 0.82rem; font-weight: 600; color: #94a3b8; }
.fc-sub { font-size: 0.72rem; color: #64748b; margin-top: 0.15rem; }

.finance-chart-wrap { background: rgba(15,15,30,0.5); border: 1px solid rgba(79,70,229,0.1); border-radius: 14px; padding: 1.5rem; }

/* Bar chart */
.bar-chart { display: flex; align-items: flex-end; gap: 0.75rem; height: 160px; padding-bottom: 2rem; }
.bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; height: 100%; }
.bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.bar-fill { width: 100%; min-height: 4px; background: linear-gradient(180deg, #7c3aed, #4f46e5); border-radius: 6px 6px 0 0; transition: height 0.5s ease; }
.bar-val { font-size: 0.68rem; font-weight: 700; color: #818cf8; }
.bar-lbl { font-size: 0.65rem; color: #64748b; text-align: center; }

/* ===== CHAT ADMIN ===== */
.chat-admin-layout { display: flex; gap: 1rem; height: 580px; }

.chat-rooms-list { width: 260px; flex-shrink: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 0.3rem; }

.chat-room-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0.8rem; border-radius: 10px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
.chat-room-item:hover { background: rgba(79,70,229,0.08); border-color: rgba(79,70,229,0.15); }
.chat-room-item.active { background: rgba(79,70,229,0.15); border-color: rgba(79,70,229,0.3); }

.room-icon { width: 36px; height: 36px; background: rgba(79,70,229,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #818cf8; flex-shrink: 0; }
.room-name { font-size: 0.85rem; font-weight: 600; color: #f1f5f9; }
.room-meta { font-size: 0.72rem; color: #64748b; }
.room-info { flex: 1; overflow: hidden; }

.clear-room-btn { background: none; border: none; color: transparent; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.15s; font-size: 0.8rem; }
.chat-room-item:hover .clear-room-btn { color: #ef4444; }
.clear-room-btn:hover { background: rgba(239,68,68,0.12); }

.empty-rooms { text-align: center; padding: 2rem; color: #64748b; }
.empty-rooms i { font-size: 2rem; display: block; margin-bottom: 0.5rem; }

.chat-messages-panel { flex: 1; background: rgba(10,10,20,0.5); border: 1px solid rgba(79,70,229,0.12); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }

.msg-empty, .msg-empty-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; color: #475569; gap: 0.5rem; }
.msg-empty i, .msg-empty-inner i { font-size: 2rem; }

.msg-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid rgba(79,70,229,0.12); background: rgba(15,15,30,0.8); flex-shrink: 0; }

.danger-clear-btn { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; padding: 5px 14px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.danger-clear-btn:hover { background: rgba(239,68,68,0.22); }

.msg-list { flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }

.msg-row { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.6rem; border-radius: 8px; transition: background 0.15s; }
.msg-row:hover { background: rgba(79,70,229,0.06); }
.msg-row:hover .msg-del-btn { opacity: 1; }

.msg-sender-avatar { width: 30px; height: 30px; border-radius: 50%; background: rgba(79,70,229,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; color: #818cf8; flex-shrink: 0; }
.msg-body { flex: 1; }
.msg-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; flex-wrap: wrap; }
.msg-sender { font-size: 0.82rem; font-weight: 600; color: #a5b4fc; }
.msg-username { font-size: 0.72rem; color: #64748b; }
.msg-role-badge { font-size: 0.65rem; padding: 1px 6px; border-radius: 8px; }
.msg-role-badge.admin { background: rgba(124,58,237,0.2); color: #c4b5fd; }
.msg-role-badge.mentor { background: rgba(16,185,129,0.2); color: #6ee7b7; }
.msg-role-badge.student { background: rgba(59,130,246,0.2); color: #93c5fd; }
.msg-time { font-size: 0.68rem; color: #64748b; margin-left: auto; }
.msg-content { font-size: 0.88rem; color: #cbd5e1; word-break: break-word; }

.msg-del-btn { background: none; border: none; color: #ef4444; opacity: 0; cursor: pointer; padding: 4px; border-radius: 6px; transition: opacity 0.15s, background 0.15s; flex-shrink: 0; }
.msg-del-btn:hover { background: rgba(239,68,68,0.12); }

/* Form */
.admin-form-wrap { max-width: 680px; }
.admin-form { display: flex; flex-direction: column; gap: 1.2rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.admin-field { display: flex; flex-direction: column; gap: 0.4rem; }
.admin-field label { font-size: 0.85rem; color: #94a3b8; }
.admin-field input, .admin-field select, .admin-field textarea { background: rgba(15,15,30,0.8); border: 1px solid rgba(79,70,229,0.2); border-radius: 10px; padding: 0.75rem 1rem; color: #f1f5f9; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
.admin-field input:focus, .admin-field select:focus, .admin-field textarea:focus { border-color: #4f46e5; }
.admin-field select option { background: #0f0f1e; }
.admin-field textarea { resize: vertical; }

.upload-type-tabs { display: flex; gap: 0.5rem; }
.upload-tab { flex: 1; padding: 0.65rem; border: 1px solid rgba(79,70,229,0.2); background: transparent; color: #64748b; border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
.upload-tab.active { background: rgba(79,70,229,0.15); border-color: #4f46e5; color: #818cf8; }

.file-drop-zone { border: 2px dashed rgba(79,70,229,0.3); border-radius: 12px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; color: #64748b; }
.file-drop-zone:hover { border-color: #4f46e5; background: rgba(79,70,229,0.05); }
.selected-file { color: #e2e8f0; }

.upload-progress { margin-top: 0.5rem; background: rgba(79,70,229,0.1); border-radius: 6px; height: 8px; position: relative; }
.upload-progress-bar { height: 100%; background: linear-gradient(90deg,#4f46e5,#a855f7); border-radius: 6px; transition: width 0.3s; }
.upload-progress span { position: absolute; right: 0; top: -20px; font-size: 0.75rem; color: #818cf8; }

.admin-submit-btn { padding: 0.9rem 2rem; background: linear-gradient(135deg,#4f46e5,#7c3aed); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 0.95rem; transition: opacity 0.2s; align-self: flex-start; }
.admin-submit-btn:hover:not(:disabled) { opacity: 0.9; }
.admin-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.admin-alert { padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.9rem; margin-bottom: 1rem; }
.admin-alert.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; }
.admin-alert.danger { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
/* ===== QUIZ MANAGEMENT ===== */
.btn-add-quiz {
  background: rgba(79,70,229,0.15);
  border: 1px solid rgba(79,70,229,0.3);
  border-radius: 10px;
  color: #818cf8;
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.btn-add-quiz:hover { background: rgba(79,70,229,0.25); }

.quiz-form-wrap {
  background: rgba(15,15,30,0.6);
  border: 1px solid rgba(79,70,229,0.15);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.field-hint { font-size: 0.75rem; color: #64748b; margin-top: 0.3rem; display: block; }

.questions-list { display: flex; flex-direction: column; gap: 1rem; }

.question-edit-card {
  background: rgba(79,70,229,0.05);
  border: 1px solid rgba(79,70,229,0.12);
  border-radius: 12px;
  padding: 1rem 1.1rem;
}

.qe-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
.qe-num { font-size: 0.78rem; font-weight: 700; color: #818cf8; text-transform: uppercase; }
.qe-remove { background: rgba(239,68,68,0.1); border: none; border-radius: 6px; color: #fca5a5; width: 26px; height: 26px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }
.qe-remove:hover { background: rgba(239,68,68,0.2); }

.qe-input {
  width: 100%;
  background: rgba(15,15,30,0.6);
  border: 1px solid rgba(79,70,229,0.2);
  border-radius: 8px;
  color: #f1f5f9;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  outline: none;
}
.qe-input:focus { border-color: #4f46e5; }

.qe-options { display: flex; flex-direction: column; gap: 0.4rem; }
.qe-option-row { display: flex; align-items: center; gap: 0.6rem; }
.qe-radio { width: 16px; height: 16px; accent-color: #4f46e5; flex-shrink: 0; cursor: pointer; }
.qe-opt-input {
  flex: 1;
  background: rgba(15,15,30,0.5);
  border: 1px solid rgba(79,70,229,0.15);
  border-radius: 6px;
  color: #cbd5e1;
  padding: 0.4rem 0.7rem;
  font-size: 0.85rem;
  outline: none;
}
.qe-opt-input:focus { border-color: #4f46e5; }
.qe-hint { font-size: 0.7rem; color: #475569; margin: 0.4rem 0 0; }

.btn-add-q {
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 10px;
  color: #6ee7b7;
  padding: 0.55rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.btn-add-q:hover { background: rgba(16,185,129,0.18); }
</style>
