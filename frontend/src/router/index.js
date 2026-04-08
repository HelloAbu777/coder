import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/LandingPage.vue') },
  { path: '/login', component: () => import('../views/LoginPage.vue') },
  { path: '/register', component: () => import('../views/RegisterPage.vue') },
  { path: '/payment', component: () => import('../views/PaymentPage.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', component: () => import('../views/DashboardPage.vue'), meta: { requiresAuth: true, requiresPaid: true } },
  { path: '/videos', component: () => import('../views/VideosPage.vue'), meta: { requiresAuth: true, requiresPaid: true } },
  { path: '/quiz', component: () => import('../views/QuizPage.vue'), meta: { requiresAuth: true, requiresPaid: true } },
  { path: '/chat', component: () => import('../views/ChatPage.vue'), meta: { requiresAuth: true, requiresPaid: true } },
  { path: '/code', component: () => import('../views/CodePage.vue'), meta: { requiresAuth: true, requiresPaid: true } },
  { path: '/certificates', component: () => import('../views/CertificatesPage.vue'), meta: { requiresAuth: true, requiresPaid: true } },
  { path: '/profile/:username', component: () => import('../views/ProfilePage.vue') },
  { path: '/admin', component: () => import('../views/AdminPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/mentor', component: () => import('../views/MentorPage.vue'), meta: { requiresAuth: true, requiresMentor: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (to.meta.requiresAuth && !token) return next('/login');
  if (to.meta.requiresPaid && user && !user.isPaid) return next('/payment');
  if (to.meta.requiresAdmin && user?.role !== 'admin') return next('/dashboard');
  if (to.meta.requiresMentor && !['mentor', 'admin'].includes(user?.role)) return next('/dashboard');

  next();
});

export default router;
