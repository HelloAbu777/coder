<template>
  <div class="landing">

    <!-- NAV -->
    <nav class="landing-nav">
      <div class="container d-flex justify-content-between align-items-center py-3">
        <div class="landing-logo">CODERS</div>
        <div class="d-flex gap-3">
          <RouterLink to="/login" class="btn btn-sm btn-outline-primary px-4">Kirish</RouterLink>
          <RouterLink to="/register" class="btn btn-sm btn-primary px-4">Boshlash</RouterLink>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero-section">
      <div class="hero-bg-grid"></div>
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>

      <div class="container text-center hero-content">
        <div class="hero-badge animate-fade-up">
          <span class="dot"></span> Dasturchilar platformasi — v1
        </div>

        <h1 class="hero-title animate-fade-up delay-1">
          Kod yozishni<br>
          <span class="gradient-text">professional darajada</span><br>
          o'rganing
        </h1>

        <p class="hero-desc animate-fade-up delay-2">
          HTML, CSS, JavaScript, Node.js va Python — barchasi bir platformada.<br>
          Video darslar, testlar va mentor yordami bilan.
        </p>

        <div class="d-flex gap-3 justify-content-center flex-wrap animate-fade-up delay-3">
          <RouterLink to="/register" class="btn btn-primary btn-lg px-5 hero-btn">
            Boshlash — 299,000 so'm <i class="bi bi-arrow-right ms-2"></i>
          </RouterLink>
          <RouterLink to="/login" class="btn btn-glass btn-lg px-5">
            Kirish
          </RouterLink>
        </div>

        <!-- Floating kod bloklari -->
        <div class="code-float code-float-1 animate-float">
          <span class="code-keyword">const</span> <span class="code-var">dev</span> = <span class="code-string">"CODERS"</span>;
        </div>
        <div class="code-float code-float-2 animate-float delay-float">
          <span class="code-keyword">def</span> <span class="code-fn">learn</span>(): 🚀
        </div>
        <div class="code-float code-float-3 animate-float">
          &lt;<span class="code-keyword">div</span> <span class="code-var">class</span>=<span class="code-string">"pro"</span>&gt;
        </div>
      </div>

      <!-- Stats -->
      <div class="container animate-fade-up delay-4">
        <div class="hero-stats">
          <div v-for="s in stats" :key="s.label" class="hero-stat">
            <div class="hero-stat-value">{{ s.value }}</div>
            <div class="hero-stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- KURSLAR -->
    <section class="py-5 section-dark">
      <div class="container">
        <div class="section-header text-center mb-5">
          <span class="section-tag">Dasturlash tillari</span>
          <h2 class="section-title mt-2">Nima o'rganasiz?</h2>
        </div>
        <div class="row g-4 justify-content-center">
          <div v-for="c in courses" :key="c.name" class="col-6 col-md-4 col-lg-2">
            <div class="course-card">
              <div class="course-icon">{{ c.icon }}</div>
              <div class="course-name">{{ c.name }}</div>
              <div class="course-meta">{{ c.lessons }} ta dars</div>
              <div class="course-progress">
                <div class="course-progress-bar" :style="`width:${c.pct}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- XUSUSIYATLAR -->
    <section class="py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <span class="section-tag">Platform imkoniyatlari</span>
          <h2 class="section-title mt-2">Nima bor?</h2>
        </div>
        <div class="row g-4">
          <div v-for="f in features" :key="f.title" class="col-md-6 col-lg-4">
            <div class="feature-card">
              <div class="feature-icon-wrap">
                <i :class="f.icon"></i>
              </div>
              <h5 class="feature-title">{{ f.title }}</h5>
              <p class="feature-desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NARX -->
    <section class="py-5 section-dark">
      <div class="container text-center">
        <div class="section-header mb-5">
          <span class="section-tag">Narx</span>
          <h2 class="section-title mt-2">Bir martalik to'lov</h2>
        </div>
        <div class="price-card mx-auto">
          <div class="price-glow"></div>
          <div class="price-amount">299,000</div>
          <div class="price-currency">so'm — bir martalik, umrbod kirish</div>
          <ul class="price-list">
            <li v-for="item in priceItems" :key="item">
              <i class="bi bi-check-circle-fill"></i> {{ item }}
            </li>
          </ul>
          <RouterLink to="/register" class="btn btn-primary w-100 btn-lg mt-3">
            Hozir boshlash <i class="bi bi-arrow-right ms-2"></i>
          </RouterLink>
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
      { value: '5', label: "Bo'limlar" },
      { value: '5', label: 'Daraja' },
      { value: '24/7', label: 'Kirish' }
    ];

    const courses = [
      { icon: '🌐', name: 'HTML', lessons: 10, pct: 100 },
      { icon: '🎨', name: 'CSS', lessons: 12, pct: 100 },
      { icon: '⚡', name: 'JavaScript', lessons: 20, pct: 85 },
      { icon: '🖥️', name: 'Node.js', lessons: 15, pct: 70 },
      { icon: '🐍', name: 'Python', lessons: 18, pct: 60 }
    ];

    const features = [
      { icon: 'bi bi-play-circle-fill', title: 'Video darslar', desc: 'Ketma-ket video darslar, har biri test bilan tugaydi' },
      { icon: 'bi bi-patch-question-fill', title: 'Testlar', desc: '80+ ball olganda keyingi darsga o\'tasiz' },
      { icon: 'bi bi-trophy-fill', title: 'Daraja tizimi', desc: 'Beginner dan Pro gacha 5 daraja' },
      { icon: 'bi bi-award-fill', title: 'Sertifikatlar', desc: 'Har bo\'lim uchun PDF sertifikat' },
      { icon: 'bi bi-chat-dots-fill', title: 'Mentor yordami', desc: 'Mentor bilan shaxsiy va umumiy chat' },
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

<style scoped>
.landing { background: #0a0a14; min-height: 100vh; }

/* NAV */
.landing-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(10,10,20,0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(79,70,229,0.15);
}
.landing-logo {
  font-size: 1.5rem; font-weight: 900;
  background: linear-gradient(135deg,#4f46e5,#7c3aed,#a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

/* HERO */
.hero-section {
  min-height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  position: relative; overflow: hidden;
  padding: 120px 0 80px;
}
.hero-bg-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(79,70,229,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79,70,229,0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}
.hero-orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none;
}
.hero-orb-1 { width:500px;height:500px;background:rgba(79,70,229,0.15);top:-100px;right:-100px;animation:orbFloat 8s ease-in-out infinite; }
.hero-orb-2 { width:400px;height:400px;background:rgba(124,58,237,0.1);bottom:-50px;left:-100px;animation:orbFloat 10s ease-in-out infinite reverse; }
.hero-orb-3 { width:300px;height:300px;background:rgba(168,85,247,0.08);top:50%;left:50%;transform:translate(-50%,-50%);animation:orbFloat 6s ease-in-out infinite; }

.hero-content { position: relative; z-index: 2; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(79,70,229,0.15);
  border: 1px solid rgba(79,70,229,0.3);
  color: #a5b4fc; padding: 6px 18px; border-radius: 20px;
  font-size: 0.85rem; margin-bottom: 2rem;
}
.dot { width:8px;height:8px;background:#4f46e5;border-radius:50%;animation:pulse 2s infinite; }

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900; line-height: 1.1;
  color: #fff; margin-bottom: 1.5rem;
}
.gradient-text {
  background: linear-gradient(135deg,#4f46e5,#7c3aed,#a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-desc {
  font-size: 1.1rem; color: #94a3b8;
  max-width: 600px; margin: 0 auto 2.5rem;
  line-height: 1.7;
}
.hero-btn { box-shadow: 0 0 30px rgba(79,70,229,0.4); }

.btn-glass {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff; backdrop-filter: blur(8px);
  border-radius: 8px;
}
.btn-glass:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* Floating kod */
.code-float {
  position: absolute; background: rgba(15,15,30,0.9);
  border: 1px solid rgba(79,70,229,0.3);
  padding: 8px 16px; border-radius: 8px;
  font-family: monospace; font-size: 0.8rem;
  backdrop-filter: blur(8px); white-space: nowrap;
  z-index: 1;
}
.code-float-1 { top: 20%; left: 5%; }
.code-float-2 { top: 30%; right: 5%; }
.code-float-3 { bottom: 25%; left: 8%; }
.code-keyword { color: #c678dd; }
.code-var { color: #e06c75; }
.code-string { color: #98c379; }
.code-fn { color: #61afef; }

/* Stats */
.hero-stats {
  display: flex; justify-content: center; gap: 2rem;
  flex-wrap: wrap; margin-top: 4rem;
  position: relative; z-index: 2;
}
.hero-stat {
  text-align: center;
  background: rgba(79,70,229,0.08);
  border: 1px solid rgba(79,70,229,0.2);
  padding: 1.2rem 2rem; border-radius: 12px;
  min-width: 130px;
}
.hero-stat-value { font-size: 2rem; font-weight: 800; color: #4f46e5; }
.hero-stat-label { font-size: 0.8rem; color: #64748b; margin-top: 4px; }

/* Kurslar */
.section-dark { background: rgba(15,15,30,0.8); }
.section-tag {
  display: inline-block;
  background: rgba(79,70,229,0.15);
  border: 1px solid rgba(79,70,229,0.3);
  color: #a5b4fc; padding: 4px 14px; border-radius: 20px;
  font-size: 0.8rem;
}
.section-title {
  font-size: 2.2rem; font-weight: 800;
  background: linear-gradient(135deg,#fff,#a5b4fc);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.course-card {
  background: rgba(20,20,35,0.8);
  border: 1px solid rgba(79,70,229,0.15);
  border-radius: 16px; padding: 1.5rem 1rem;
  text-align: center; transition: all 0.3s;
}
.course-card:hover {
  border-color: rgba(79,70,229,0.5);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(79,70,229,0.2);
}
.course-icon { font-size: 2.5rem; margin-bottom: 0.8rem; }
.course-name { font-weight: 700; color: #e2e8f0; margin-bottom: 0.3rem; }
.course-meta { font-size: 0.75rem; color: #64748b; margin-bottom: 0.8rem; }
.course-progress { height: 4px; background: rgba(79,70,229,0.1); border-radius: 2px; }
.course-progress-bar { height: 100%; background: linear-gradient(90deg,#4f46e5,#a855f7); border-radius: 2px; transition: width 1s; }

/* Features */
.feature-card {
  background: rgba(20,20,35,0.6);
  border: 1px solid rgba(79,70,229,0.1);
  border-radius: 16px; padding: 2rem;
  transition: all 0.3s; height: 100%;
}
.feature-card:hover {
  border-color: rgba(79,70,229,0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(79,70,229,0.15);
}
.feature-icon-wrap {
  width: 52px; height: 52px;
  background: rgba(79,70,229,0.15);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: #818cf8;
  margin-bottom: 1rem;
}
.feature-title { font-weight: 700; color: #e2e8f0; margin-bottom: 0.5rem; }
.feature-desc { font-size: 0.9rem; color: #64748b; margin: 0; }

/* Price */
.price-card {
  max-width: 420px; position: relative;
  background: rgba(20,20,35,0.9);
  border: 1px solid rgba(79,70,229,0.3);
  border-radius: 20px; padding: 2.5rem;
  overflow: hidden;
}
.price-glow {
  position: absolute; top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.price-amount { font-size: 3.5rem; font-weight: 900; color: #818cf8; line-height: 1; }
.price-currency { color: #64748b; margin: 0.5rem 0 1.5rem; font-size: 0.9rem; }
.price-list { list-style: none; padding: 0; text-align: left; }
.price-list li { color: #cbd5e1; padding: 0.4rem 0; font-size: 0.95rem; }
.price-list li i { color: #10b981; margin-right: 8px; }

/* Animatsiyalar */
@keyframes orbFloat {
  0%,100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}
@keyframes pulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.animate-fade-up { animation: fadeUp 0.8s ease forwards; }
.delay-1 { animation-delay: 0.1s; opacity: 0; }
.delay-2 { animation-delay: 0.2s; opacity: 0; }
.delay-3 { animation-delay: 0.3s; opacity: 0; }
.delay-4 { animation-delay: 0.4s; opacity: 0; }
.animate-float { animation: float 4s ease-in-out infinite; }
.delay-float { animation-delay: 1.5s; }
</style>
