// ===== Generic Async Request Composable =====
import { ref } from 'vue'

export function useRequest(requestFn, options = {}) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const executed = ref(false)

  async function execute(...args) {
    loading.value = true
    error.value = null
    try {
      const result = await requestFn(...args)
      data.value = result
      executed.value = true
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  if (options.immediate) {
    execute(...(options.initialArgs ?? []))
  }

  return { data, loading, error, executed, execute }
}
