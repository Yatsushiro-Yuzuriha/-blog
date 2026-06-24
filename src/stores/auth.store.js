// ===== Auth Store =====
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth.api'
import { getItem, setItem, removeItem, clearAll } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const user = ref(null)
  const token = ref(null)
  const refreshToken = ref(null)

  // --- Getters ---
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role ?? null)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isAuthor = computed(() => userRole.value === 'author' || isAdmin.value)

  // --- Actions ---
  function persistSession() {
    setItem('access_token', token.value)
    setItem('refresh_token', refreshToken.value)
    setItem('user', user.value)
  }

  function restoreSession() {
    const savedToken = getItem('access_token')
    const savedRefresh = getItem('refresh_token')
    const savedUser = getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      refreshToken.value = savedRefresh
      user.value = savedUser
    }
  }

  async function login(credentials) {
    const res = await authApi.login(credentials)
    token.value = res.accessToken
    refreshToken.value = res.refreshToken
    user.value = res.user
    persistSession()
  }

  async function register(data) {
    const res = await authApi.register(data)
    token.value = res.accessToken
    refreshToken.value = res.refreshToken
    user.value = res.user
    persistSession()
  }

  async function fetchProfile() {
    const res = await authApi.getProfile()
    user.value = res
    setItem('user', res)
  }

  function logout() {
    user.value = null
    token.value = null
    refreshToken.value = null
    removeItem('access_token')
    removeItem('refresh_token')
    removeItem('user')
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) throw new Error('No refresh token')
    const res = await authApi.refreshToken(refreshToken.value)
    token.value = res.accessToken
    setItem('access_token', res.accessToken)
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    userRole,
    isAdmin,
    isAuthor,
    login,
    register,
    fetchProfile,
    logout,
    restoreSession,
    refreshAccessToken,
    persistSession,
  }
})
