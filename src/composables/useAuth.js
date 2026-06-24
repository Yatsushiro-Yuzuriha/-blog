// ===== Auth Composable =====
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.user)
  const isAdmin = computed(() => authStore.isAdmin)

  async function login(credentials) {
    await authStore.login(credentials)
    const redirect = router.currentRoute.value.query.redirect
    router.push(redirect || '/')
  }

  async function logout() {
    authStore.logout()
    router.push('/')
  }

  return {
    isAuthenticated,
    currentUser,
    isAdmin,
    login,
    logout,
    authStore,
  }
}
