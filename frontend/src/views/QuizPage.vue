<template>
  <div class="container py-5" style="max-width:700px">
    <h2 class="section-title mb-5">Test</h2>

    <!-- Natija -->
    <div v-if="result" class="card-dark p-5 text-center">
      <div class="fs-1 mb-3">{{ result.passed ? '🎉' : '😔' }}</div>
      <h4 class="fw-bold mb-2" style="color:var(--text-light)">
        {{ result.passed ? 'Tabriklaymiz!' : 'Muvaffaqiyatsiz' }}
      </h4>
      <div class="display-4 fw-bold mb-2" :style="result.passed ? 'color:var(--success)' : 'color:var(--danger)'">
        {{ result.score }}%
      </div>
      <p class="small mb-4" style="color:var(--text-muted)">
        {{ result.correctCount }} / {{ result.total }} to'g'ri javob
      </p>
      <div class="d-flex gap-3 justify-content-center flex-wrap">
        <button class="btn btn-primary" @click="reset">Qayta urinish</button>
        <RouterLink to="/videos" class="btn btn-outline-primary">Darslarga qaytish</RouterLink>
      </div>
    </div>

    <!-- Test -->
    <div v-else-if="quiz">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="fw-semibold mb-0" style="color:var(--text-light)">{{ quiz.title }}</h5>
        <span class="badge" style="background:rgba(79,70,229,0.2);color:#a5b4fc">
          {{ currentIndex + 1 }} / {{ quiz.questions.length }}
        </span>
      </div>

      <ProgressBar :value="Math.round(((currentIndex) / quiz.questions.length) * 100)" class="mb-4" />

      <div class="card-dark p-4 mb-4">
        <p class="fw-semibold mb-0" style="color:var(--text-light)">{{ currentQuestion.question }}</p>
      </div>

      <div class="d-flex flex-column gap-3 mb-5">
        <button
          v-for="(opt, i) in currentQuestion.options" :key="i"
          class="btn text-start p-3"
          :class="selectedAnswer === i ? 'btn-primary' : 'btn-outline-secondary'"
          style="border-radius:10px"
          @click="selectedAnswer = i">
          <span class="me-2 fw-bold">{{ String.fromCharCode(65 + i) }}.</span>{{ opt }}
        </button>
      </div>

      <div class="d-flex justify-content-between">
        <button v-if="currentIndex > 0" class="btn btn-outline-secondary" @click="prev">
          <i class="bi bi-arrow-left me-2"></i>Oldingi
        </button>
        <button v-else class="btn btn-outline-secondary invisible">—</button>

        <button
          v-if="currentIndex < quiz.questions.length - 1"
          class="btn btn-primary"
          :disabled="selectedAnswer === null"
          @click="next">
          Keyingi<i class="bi bi-arrow-right ms-2"></i>
        </button>
        <button
          v-else
          class="btn btn-primary"
          :disabled="selectedAnswer === null || submitting"
          @click="submit">
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
          Yuborish
        </button>
      </div>
    </div>

    <!-- Yuklanmoqda -->
    <div v-else-if="loading" class="text-center py-5" style="color:var(--text-muted)">
      <div class="spinner-border mb-3" style="color:var(--primary)"></div>
      <p>Test yuklanmoqda...</p>
    </div>

    <div v-else class="text-center py-5" style="color:var(--text-muted)">
      <i class="bi bi-patch-question fs-1 d-block mb-3"></i>
      <p>Test topilmadi</p>
      <RouterLink to="/videos" class="btn btn-primary">Darslarga qaytish</RouterLink>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import ProgressBar from '../components/ProgressBar.vue';
import api from '../utils/axios.js';
import { useRoute } from 'vue-router';

export default {
  name: 'QuizPage',
  components: { ProgressBar },
  setup() {
    const route = useRoute();
    const quiz = ref(null);
    const loading = ref(true);
    const submitting = ref(false);
    const result = ref(null);
    const currentIndex = ref(0);
    const answers = ref([]);
    const selectedAnswer = ref(null);

    const currentQuestion = computed(() => quiz.value?.questions[currentIndex.value]);

    const next = () => {
      answers.value[currentIndex.value] = selectedAnswer.value;
      selectedAnswer.value = answers.value[currentIndex.value + 1] ?? null;
      currentIndex.value++;
    };

    const prev = () => {
      answers.value[currentIndex.value] = selectedAnswer.value;
      currentIndex.value--;
      selectedAnswer.value = answers.value[currentIndex.value] ?? null;
    };

    const submit = async () => {
      answers.value[currentIndex.value] = selectedAnswer.value;
      submitting.value = true;
      try {
        const { data } = await api.post('/quiz/submit', {
          quizId: quiz.value._id,
          answers: answers.value
        });
        result.value = data;
      } catch (_) {} finally {
        submitting.value = false;
      }
    };

    const reset = () => {
      result.value = null;
      currentIndex.value = 0;
      answers.value = [];
      selectedAnswer.value = null;
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
        }
        if (res) quiz.value = res.data;
      } catch (_) {} finally {
        loading.value = false;
      }
    });

    return { quiz, loading, submitting, result, currentIndex, selectedAnswer, currentQuestion, next, prev, submit, reset };
  }
};
</script>
