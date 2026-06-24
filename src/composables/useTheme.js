// ===== Theme Composable =====
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme.store'

export function useTheme() {
  const themeStore = useThemeStore()

  const isDark = computed(() => themeStore.isDark)

  function toggle() {
    themeStore.toggle()
  }

  return { isDark, toggle, mode: themeStore.mode }
}

// Called once at app startup (before pinia is ready)
export function initTheme() {
  const saved = localStorage.getItem('theme')
  let mode = 'light'
  if (saved === 'dark' || saved === 'light') {
    mode = saved
  } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    mode = 'dark'
  }
  document.documentElement.setAttribute('data-theme', mode)
}
