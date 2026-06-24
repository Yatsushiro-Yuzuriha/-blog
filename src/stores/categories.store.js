// ===== Categories Store =====
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesApi } from '@/api/categories.api'

export const useCategoriesStore = defineStore('categories', () => {
  const list = ref([])
  const loading = ref(false)

  async function fetchList() {
    if (list.value.length > 0) return // Cache: only fetch once
    loading.value = true
    try {
      list.value = await categoriesApi.getList()
    } finally {
      loading.value = false
    }
  }

  return { list, loading, fetchList }
})
