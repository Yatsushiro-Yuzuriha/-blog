// ===== Application Bootstrap =====
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth.store'
import { initTheme } from './composables/useTheme'
import './assets/scss/index.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize theme before mounting
initTheme()

// Restore auth session from localStorage (before guards run)
const authStore = useAuthStore()
authStore.restoreSession()

app.mount('#app')
