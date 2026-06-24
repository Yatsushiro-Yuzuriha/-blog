// ===== Tags Store =====
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tagsApi } from '@/api/tags.api'

export const useTagsStore = defineStore('tags', () => {
  const list = ref([])
  const loading = ref(false)

  async function fetchList() {
    if (list.value.length > 0) return
    loading.value = true
    try {
      list.value = await tagsApi.getList()
    } finally {
      loading.value = false
    }
  }

  return { list, loading, fetchList }
})
