<template>
  <div>
    <!-- Hero -->
    <section class="min-vh-100 d-flex align-items-center" style="background:linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 50%,#16213e 100%)">
      <div class="container text-center py-5">
        <div class="mb-4">
          <span class="badge px-3 py-2 mb-4 d-inline-block" style="background:rgba(79,70,229,0.2);color:#a5b4fc;border:1px solid rgba(79,70,229,0.3);border-radius:20px">
            Dasturchilar platformasi
          </span>
        </div>
        <h1 class="display-3 fw-bold mb-4" style="line-height:1.2">
          <span style="color:#fff">Kod yozishni</span><br>
          <span style="background:linear-gradient(135deg,#4f46e5,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">
            professional darajada
          </span><br>
          <span style="color:#fff">o'rganing</span>
        </h1>
        <p class="lead mb-5" style="color:#94a3b8;max-width:600px;margin:0 auto 2rem">
          HTML, CSS, JavaScript, Node.js va Python — barchasi bir platformada. Video darslar, testlar va mentor yordami bilan.
        </p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <RouterLink to="/register" class="btn btn-primary btn-lg px-5">
            Boshlash — 299,000 so'm <i class="bi bi-arrow-right ms-2"></i>
          </RouterLink>
          <RouterLink to="/login" class="btn btn-outline-primary btn-lg px-5">
            Kirish
          </RouterLink>
        </div>

        <!-- Stats -->
        <div class="row g-4 mt-5 justify-content-center">
          <div v-for="stat in stats" :key="stat.label" class="col-6 col-md-3">
            <div class="card-dark p-4 text-center">
              <div class="fs-2 fw-bold mb-1" style="color:var(--primary)">{{ stat.value }}</div>
              <div class="small" style="color:var(--text-muted)">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kurslar -->
    <section class="py-5" style="background:var(--bg-card)">
      <div class="container">
        <h2 class="section-title text-center mb-5">Nima o'rganasiz?</h2>
        <div class="row g-4">
          <div v-for="course in courses" :key="course.name" class="col-md-4 col-lg-2-4">
            <div class="card-dark p-4 text-center h-100">
              <div class="fs-1 mb-3">{{ course.icon }}</div>
              <h5 class="fw-semibold mb-2" style="color:var(--text-light)">{{ course.name }}</h5>
              <p class="small mb-2" style="color:var(--text-muted)">{{ course.lessons }} ta dars</p>
              <span class="badge" style="background:rgba(79,70,229,0.2);color:#a5b4fc">{{ course.level }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Xususiyatlar -->
    <section class="py-5">
      <div class="container">
        <h2 class="section-title text-center mb-5">Nima bor?</h2>
        <div class="row g-4">
          <div v-for="f in features" :key="f.title" class="col-md-6 col-lg-4">
            <div class="card-dark p-4 h-100">
              <i :class="f.icon" class="fs-2 mb-3 d-block" style="color:var(--primary)"></i>
              <h5 class="fw-semibold mb-2" style="color:var(--text-light)">{{ f.title }}</h5>
              <p class="small mb-0" style="color:var(--text-muted)">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Narx -->
    <section class="py-5" style="background:var(--bg-card)">
      <div class="container text-center">
        <h2 class="section-title mb-3">Narx</h2>
        <p class="mb-5" style="color:var(--text-muted)">Bir martalik to'lov — barcha kurslar, umrbod kirish</p>
        <div class="card-dark p-5 mx-auto" style="max-width:400px;border-color:var(--primary)">
          <div class="display-5 fw-bold mb-1" style="color:var(--primary)">299,000</div>
          <div class="mb-4" style="color:var(--text-muted)">so'm — bir martalik</div>
          <ul class="list-unstyled text-start mb-4">
            <li v-for="item in priceItems" :key="item" class="mb-2 small" style="color:var(--text-light)">
              <i class="bi bi-check-circle-fill me-2" style="color:var(--success)"></i>{{ item }}
            </li>
          </ul>
          <RouterLink to="/register" class="btn btn-primary w-100 btn-lg">Hozir boshlash</RouterLink>
        </div>
      </div>
    </section>

    <FooterComp />
  </div>
</template>

<script>
import FooterComp from '../components/FooterComp.vue';

export default {
  name: 'LandingPage',
  components: { FooterComp },
  setup() {
    const stats = [
      { value: '75+', label: 'Video darslar' },
      { value: '5', label: 'Bo\'limlar' },
      { value: '5', label: 'Daraja' },
      { value: '100%', label: 'Online' }
    ];

    const courses = [
      { icon: '🌐', name: 'HTML', lessons: 10, level: 'Boshlang\'ich' },
      { icon: '🎨', name: 'CSS', lessons: 12, level: 'Boshlang\'ich' },
      { icon: '⚡', name: 'JavaScript', lessons: 20, level: 'O\'rta' },
      { icon: '🖥️', name: 'Node.js', lessons: 15, level: 'O\'rta' },
      { icon: '🐍', name: 'Python', lessons: 18, level: 'O\'rta' }
    ];

    const features = [
      { icon: 'bi bi-play-circle', title: 'Video darslar', desc: 'Ketma-ket video darslar, har biri test bilan tugaydi' },
      { icon: 'bi bi-patch-question', title: 'Testlar', desc: '80+ ball olganda keyingi darsga o\'tasiz' },
      { icon: 'bi bi-trophy', title: 'Daraja tizimi', desc: 'Beginner dan Pro gacha 5 daraja' },
      { icon: 'bi bi-award', title: 'Sertifikatlar', desc: 'Har bo\'lim uchun PDF sertifikat' },
      { icon: 'bi bi-chat-dots', title: 'Mentor yordami', desc: 'Mentor bilan shaxsiy va umumiy chat' },
      { icon: 'bi bi-code-slash', title: 'Kod saqlash', desc: 'Monaco Editor bilan kodingizni saqlang' }
    ];

    const priceItems = [
      'HTML, CSS, JS, Node.js, Python',
      '75+ video dars',
      'Barcha testlar',
      '5 ta sertifikat',
      'Mentor yordami',
      'Umrbod kirish'
    ];

    return { stats, courses, features, priceItems };
  }
};
</script>
