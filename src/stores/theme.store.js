// ===== Theme Store =====
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref('light')

  const isDark = computed(() => mode.value === 'dark')

  function init() {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      mode.value = saved
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      mode.value = 'dark'
    }
    apply()
  }

  function toggle() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', mode.value)
    apply()
  }

  function apply() {
    document.documentElement.setAttribute('data-theme', mode.value)
  }

  return { mode, isDark, init, toggle }
})
