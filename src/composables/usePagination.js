// ===== Pagination Composable =====
import { ref } from 'vue'

export function usePagination(fetchFn, initialPage = 1) {
  const page = ref(initialPage)
  const loading = ref(false)

  async function goTo(p) {
    page.value = p
    loading.value = true
    try {
      await fetchFn(p)
    } finally {
      loading.value = false
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function next() { goTo(page.value + 1) }
  function prev() { goTo(page.value - 1) }
  function reset() { goTo(1) }

  return { page, loading, goTo, next, prev, reset }
}
