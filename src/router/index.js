import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/step/1',
      name: 'StepOne',
      component: () => import('@/views/StepOne.vue')
    },
    {
      path: '/step/2',
      name: 'StepTwo',
      component: () => import('@/views/StepTwo.vue')
    }
  ]
});

export default router;
