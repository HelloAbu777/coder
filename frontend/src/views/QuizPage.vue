<template>
  <div class="quiz-wrap">

    <!-- ===== NATIJA ===== -->
    <div v-if="result" class="result-screen">
      <div class="result-card">
        <div class="result-icon" :class="result.passed ? 'pass' : 'fail'">
          <i :class="result.passed ? 'bi bi-trophy-fill' : 'bi bi-x-circle-fill'"></i>
        </div>
        <h3 class="result-title" :class="result.passed ? 'pass' : 'fail'">
          {{ result.passed ? 'Tabriklaymiz!' : 'Muvaffaqiyatsiz' }}
        </h3>

        <div v-if="result.passed" class="earned-points">
          <span class="ep-val">+{{ result.earnedPoints }}</span>
          <span class="ep-lbl">ball qo'shildi</span>
        </div>

        <div class="result-stats">
          <div class="rs-item">
            <div class="rs-val green">{{ result.correctCount }}</div>
            <div class="rs-lbl">To'g'ri</div>
          </div>
          <div class="rs-item">
            <div class="rs-val red">{{ result.wrongCount }}</div>
            <div class="rs-lbl">Xato</div>
          </div>
          <div class="rs-item">
            <div class="rs-val">{{ result.total }}</div>
            <div class="rs-lbl">Jami</div>
          </div>
        </div>

        <!-- Ball breakdown -->
        <div class="score-breakdown">
          <div class="sb-row" :class="{ active: result.earnedPoints === 10 }">
            <span>0 xato</span>
            <span class="sb-pts">10 ball</span>
          </div>
          <div class="sb-row" :class="{ active: result.earnedPoints === 9 }">
            <span>1 xato</span>
            <span class="sb-pts">9 ball</span>
          </div>
          <div class="sb-row" :class="{ active: result.earnedPoints === 8 }">
            <span>2 xato</span>
            <span class="sb-pts">8 ball</span>
          </div>
          <div class="sb-row fail-row" :class="{ active: !result.passed }">
            <span>3+ xato</span>
            <span class="sb-pts">0 ball</span>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" @click="reset">
            <i class="bi bi-arrow-clockwise me-2"></i>Qayta urinish
          </button>
          <RouterLink to="/videos" class="btn btn-outline-primary">
            <i class="bi bi-play-circle me-2"></i>Darslarga qaytish
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- ===== TEST ===== -->
    <div v-else-if="quiz" class="quiz-container">

      <!-- Header -->
      <div class="quiz-header">
        <div class="quiz-title-wrap">
          <div class="quiz-section-badge">{{ quiz.section }}</div>
          <h4 class="quiz-title">{{ quiz.title }}</h4>
        </div>

        <!-- Hayot tizimi -->
        <div class="lives-bar">
          <span class="lives-label">Xato:</span>
          <div class="lives-icons">
            <div v-for="n in 3" :key="n" class="life-dot" :class="{ used: wrongCount >= n }">
              <i :class="wrongCount >= n ? 'bi bi-x-circle-fill' : 'bi bi-circle'"></i>
            </div>
          </div>
          <span class="lives-count" :class="wrongCount >= 3 ? 'danger' : wrongCount >= 2 ? 'warn' : ''">
            {{ wrongCount }}/2
          </span>
        </div>
      </div>

      <!-- Progress -->
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-bar" :style="`width:${Math.round((currentIndex / quiz.questions.length) * 100)}%`"></div>
        <span class="quiz-progress-text">{{ currentIndex + 1 }} / {{ quiz.questions.length }}</span>
      </div>

      <!-- Savol -->
      <div class="question-card">
        <div class="question-num">Savol {{ currentIndex + 1 }}</div>
        <p class="question-text">{{ currentQuestion.question }}</p>

        <!-- Variantlar -->
        <div class="options-list">
          <button
            v-for="(opt, i) in currentQuestion.options" :key="i"
            class="option-btn"
            :class="optionClass(i)"
            :disabled="answered"
            @click="selectAnswer(i)">
            <span class="opt-letter">{{ String.fromCharCode(65 + i) }}</span>
            <span class="opt-text">{{ opt }}</span>
            <i v-if="answered && i === currentQuestion.correctIndex" class="bi bi-check-circle-fill opt-icon correct"></i>
            <i v-else-if="answered && i === selectedAnswer && i !== currentQuestion.correctIndex" class="bi bi-x-circle-fill opt-icon wrong"></i>
          </button>
        </div>

        <!-- Feedback -->
        <transition name="feedback-slide">
          <div v-if="answered" class="feedback-box" :class="isCurrentCorrect ? 'correct' : 'wrong'">
            <i :class="isCurrentCorrect ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" class="me-2"></i>
            <span v-if="isCurrentCorrect">To'g'ri javob!</span>
            <span v-else>
              Noto'g'ri. To'g'ri javob:
              <strong>{{ currentQuestion.options[currentQuestion.correctIndex] }}</strong>
            </span>
          </div>
        </transition>
      </div>

      <!-- Keyingi tugma -->
      <div class="quiz-footer">
        <div class="footer-hint" v-if="!answered">
          Javobni tanlang
        </div>
        <button
          v-if="answered"
          class="next-btn"
          @click="goNext">
          <span v-if="currentIndex < quiz.questions.length - 1">
            Keyingi savol <i class="bi bi-arrow-right ms-2"></i>
          </span>
          <span v-else>
            Natijani ko'rish <i class="bi bi-flag-fill ms-2"></i>
          </span>
        </button>
      </div>
    </div>

    <!-- ===== QULFLANGAN ===== -->
    <div v-else-if="locked" class="quiz-empty">
      <i class="bi bi-lock-fill" style="color:#f59e0b"></i>
      <h4 style="color:#f59e0b">Test qulflangan</h4>
      <p>Bu testga kirish uchun avval videoni ko'rib bo'ling</p>
      <RouterLink to="/videos" class="btn btn-primary mt-3">
        <i class="bi bi-play-circle me-2"></i>Darslarga o'tish
      </RouterLink>
    </div>

    <!-- ===== YUKLANMOQDA ===== -->
    <div v-else-if="loading" class="quiz-loading">
      <div class="spinner-border mb-3" style="color:#4f46e5;width:3rem;height:3rem"></div>
      <p>Test yuklanmoqda...</p>
    </div>

    <!-- ===== TOPILMADI ===== -->
    <div v-else class="quiz-empty">
      <i class="bi bi-patch-question"></i>
      <h4>Test topilmadi</h4>
      <p>Video ko'rib bo'lgach test avtomatik ochiladi</p>
      <RouterLink to="/videos" class="btn btn-primary mt-3">
        <i class="bi bi-play-circle me-2"></i>Darslarga o'tish
      </RouterLink>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../utils/axios.js';

export default {
  name: 'QuizPage',
  setup() {
    const route = useRoute();
    const quiz = ref(null);
    const loading = ref(true);
    const result = ref(null);
    const locked = ref(false);
    const currentIndex = ref(0);
    const selectedAnswer = ref(null);
    const answered = ref(false);
    const wrongCount = ref(0);
    const allAnswers = ref([]);

    const currentQuestion = computed(() => quiz.value?.questions[currentIndex.value]);

    const isCurrentCorrect = computed(() =>
      answered.value && selectedAnswer.value === currentQuestion.value?.correctIndex
    );

    // @returns {String} — variant tugma klassi
    const optionClass = (i) => {
      if (!answered.value) return selectedAnswer.value === i ? 'selected' : '';
      if (i === currentQuestion.value.correctIndex) return 'correct';
      if (i === selectedAnswer.value && i !== currentQuestion.value.correctIndex) return 'wrong';
      return 'dimmed';
    };

    const selectAnswer = (i) => {
      if (answered.value) return;
      selectedAnswer.value = i;
      answered.value = true;
      allAnswers.value[currentIndex.value] = i;

      if (i !== currentQuestion.value.correctIndex) {
        wrongCount.value++;
      }
    };

    const goNext = async () => {
      // 3 ta xato yoki oxirgi savol
      const isLast = currentIndex.value === quiz.value.questions.length - 1;
      const forcedEnd = wrongCount.value > 2;

      if (isLast || forcedEnd) {
        await submitQuiz();
        return;
      }

      currentIndex.value++;
      selectedAnswer.value = null;
      answered.value = false;
    };

    const submitQuiz = async () => {
      try {
        // Qolgan savollarni null bilan to'ldirish (agar test to'xtatilgan bo'lsa)
        const filledAnswers = quiz.value.questions.map((_, i) =>
          allAnswers.value[i] !== undefined ? allAnswers.value[i] : -1
        );
        const { data } = await api.post('/quiz/submit', {
          quizId: quiz.value._id,
          answers: filledAnswers
        });
        result.value = data;
      } catch (_) {}
    };

    const reset = () => {
      result.value = null;
      currentIndex.value = 0;
      selectedAnswer.value = null;
      answered.value = false;
      wrongCount.value = 0;
      allAnswers.value = [];
    };

    onMounted(async () => {
      try {
        const videoId = route.query.videoId;
        const section = route.query.section;
        const checkpoint = route.query.checkpoint;

        let res;
        if (checkpoint && section) {
          res = await api.get(`/quiz/checkpoint/${section}`);
        } else if (videoId) {
          res = await api.get(`/quiz/video/${videoId}`);
        } else if (section) {
          res = await api.get(`/quiz/section/${section}`);
        }
        if (res) quiz.value = res.data;
      } catch (err) {
        if (err.response?.status === 403) locked.value = true;
      } finally {
        loading.value = false;
      }
    });

    return {
      quiz, loading, result, locked, currentIndex, selectedAnswer,
      answered, wrongCount, currentQuestion, isCurrentCorrect,
      optionClass, selectAnswer, goNext, reset
    };
  }
};
</script>

<style scoped>
.quiz-wrap {
  min-height: 100vh;
  background: var(--bg-dark);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
}

/* ===== RESULT ===== */
.result-screen {
  width: 100%;
  max-width: 520px;
  padding-top: 2rem;
}

.result-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
}

.result-icon {
  width: 80px; height: 80px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.25rem;
}
.result-icon.pass { background: rgba(16,185,129,0.15); color: #10b981; }
.result-icon.fail { background: rgba(239,68,68,0.12); color: #ef4444; }

.result-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; }
.result-title.pass { color: #10b981; }
.result-title.fail { color: #ef4444; }

.earned-points {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.25);
  border-radius: 30px;
  padding: 0.4rem 1.2rem;
  margin-bottom: 1.5rem;
}
.ep-val { font-size: 1.4rem; font-weight: 900; color: #10b981; }
.ep-lbl { font-size: 0.85rem; color: #6ee7b7; }

.result-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.rs-item { text-align: center; }
.rs-val { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
.rs-val.green { color: #10b981; }
.rs-val.red { color: #ef4444; }
.rs-lbl { font-size: 0.78rem; color: #64748b; }

.score-breakdown {
  background: rgba(15,15,30,0.5);
  border: 1px solid rgba(79,70,229,0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
}
.sb-row {
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #64748b;
  transition: all 0.2s;
}
.sb-row.active { background: rgba(79,70,229,0.12); color: #f1f5f9; }
.sb-row.fail-row.active { background: rgba(239,68,68,0.1); color: #fca5a5; }
.sb-pts { font-weight: 700; }

.result-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

/* ===== QUIZ ===== */
.quiz-container {
  width: 100%;
  max-width: 620px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.quiz-section-badge {
  display: inline-block;
  background: rgba(79,70,229,0.15);
  color: #818cf8;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.quiz-title { font-size: 1.05rem; font-weight: 700; color: #f1f5f9; margin: 0; }

.lives-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(15,15,30,0.8);
  border: 1px solid rgba(79,70,229,0.15);
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  flex-shrink: 0;
}
.lives-label { font-size: 0.75rem; color: #64748b; }
.lives-icons { display: flex; gap: 0.3rem; }
.life-dot i { font-size: 1rem; transition: color 0.2s; }
.life-dot:not(.used) i { color: #4f46e5; }
.life-dot.used i { color: #ef4444; }
.lives-count { font-size: 0.78rem; font-weight: 700; color: #f1f5f9; margin-left: 0.25rem; }
.lives-count.warn { color: #f59e0b; }
.lives-count.danger { color: #ef4444; }

.quiz-progress-wrap {
  position: relative;
  height: 6px;
  background: rgba(79,70,229,0.12);
  border-radius: 3px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.quiz-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 3px;
  transition: width 0.4s ease;
}
.quiz-progress-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 0.72rem;
  color: #64748b;
}

.question-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1rem;
}

.question-num { font-size: 0.75rem; color: #818cf8; font-weight: 600; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; }
.question-text { font-size: 1.05rem; font-weight: 600; color: #f1f5f9; margin-bottom: 1.5rem; line-height: 1.5; }

.options-list { display: flex; flex-direction: column; gap: 0.65rem; }

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(15,15,30,0.6);
  border: 1.5px solid rgba(79,70,229,0.15);
  border-radius: 12px;
  color: #cbd5e1;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
}
.option-btn:hover:not(:disabled):not(.correct):not(.wrong):not(.dimmed) {
  background: rgba(79,70,229,0.1);
  border-color: rgba(79,70,229,0.4);
  color: #f1f5f9;
}
.option-btn.selected { background: rgba(79,70,229,0.15); border-color: #4f46e5; color: #f1f5f9; }
.option-btn.correct { background: rgba(16,185,129,0.12); border-color: #10b981; color: #f1f5f9; }
.option-btn.wrong { background: rgba(239,68,68,0.1); border-color: #ef4444; color: #f1f5f9; }
.option-btn.dimmed { opacity: 0.4; cursor: default; }
.option-btn:disabled { cursor: default; }

.opt-letter {
  width: 28px; height: 28px;
  background: rgba(79,70,229,0.15);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; color: #818cf8;
  flex-shrink: 0;
}
.option-btn.correct .opt-letter { background: rgba(16,185,129,0.2); color: #10b981; }
.option-btn.wrong .opt-letter { background: rgba(239,68,68,0.15); color: #ef4444; }

.opt-text { flex: 1; font-size: 0.95rem; }
.opt-icon { margin-left: auto; font-size: 1.1rem; flex-shrink: 0; }
.opt-icon.correct { color: #10b981; }
.opt-icon.wrong { color: #ef4444; }

/* Feedback */
.feedback-box {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  margin-top: 1rem;
}
.feedback-box.correct { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #6ee7b7; }
.feedback-box.wrong { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; }

.feedback-slide-enter-active { transition: all 0.25s ease; }
.feedback-slide-enter-from { opacity: 0; transform: translateY(-8px); }

/* Footer */
.quiz-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 0;
}

.footer-hint { font-size: 0.82rem; color: #475569; margin-right: auto; }

.next-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  border-radius: 12px;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
}
.next-btn:hover { opacity: 0.9; transform: translateY(-1px); }

/* Loading / Empty */
.quiz-loading, .quiz-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #64748b;
  text-align: center;
}
.quiz-empty i { font-size: 3rem; margin-bottom: 1rem; }
.quiz-empty h4 { color: #94a3b8; margin-bottom: 0.5rem; }
</style>
