// ===== Router Setup =====
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { guestGuard, authGuard, adminGuard } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

// ===== Global Navigation Guards =====
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = to.meta.title ? `${to.meta.title} | 个人博客` : '个人博客'

  // Apply route-specific guards
  if (to.meta.guest) {
    guestGuard(to, from, next)
  } else if (to.meta.roles && to.meta.roles.length > 0) {
    adminGuard(to, from, next)
  } else if (to.meta.requiresAuth) {
    authGuard(to, from, next)
  } else {
    next()
  }
})

export default router
