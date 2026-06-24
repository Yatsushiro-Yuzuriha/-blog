// ===== Articles Store =====
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { articlesApi } from '@/api/articles.api'
import { PAGE_SIZE } from '@/utils/constants'

export const useArticlesStore = defineStore('articles', () => {
  // --- State ---
  const list = ref([])
  const current = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(PAGE_SIZE)
  const total = ref(0)
  const selectedCategory = ref(null)
  const selectedTag = ref(null)
  const searchQuery = ref('')
  const loading = ref(false)
  const prevArticle = ref(null)
  const nextArticle = ref(null)

  // --- Getters ---
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value) || 0)
  const hasPrevPage = computed(() => currentPage.value > 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)

  // --- Actions ---
  async function fetchList(params = {}) {
    loading.value = true
    try {
      const queryParams = {
        page: params.page ?? currentPage.value,
        pageSize: params.pageSize ?? pageSize.value,
      }
      // Only include non-null optional params
      const category = params.category ?? selectedCategory.value
      if (category != null) queryParams.category = category
      const tag = params.tag ?? selectedTag.value
      if (tag != null) queryParams.tag = tag
      if (params.status != null) queryParams.status = params.status

      const res = await articlesApi.getList(queryParams)
      list.value = res.list
      total.value = res.total
      currentPage.value = res.page
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id) {
    loading.value = true
    try {
      current.value = await articlesApi.getDetail(id)
      // Fetch prev/next
      try {
        const nav = await articlesApi.getPrevNext(id)
        prevArticle.value = nav.prev
        nextArticle.value = nav.next
      } catch {
        prevArticle.value = null
        nextArticle.value = null
      }
    } finally {
      loading.value = false
    }
  }

  async function search(q, page = 1) {
    searchQuery.value = q
    loading.value = true
    try {
      const res = await articlesApi.search(q, page, pageSize.value)
      list.value = res.list
      total.value = res.total
      currentPage.value = res.page
    } finally {
      loading.value = false
    }
  }

  async function createArticle(data) {
    return await articlesApi.create(data)
  }

  async function updateArticle(id, data) {
    const updated = await articlesApi.update(id, data)
    if (current.value && current.value.id === id) {
      current.value = updated
    }
    return updated
  }

  async function deleteArticle(id) {
    await articlesApi.delete(id)
    list.value = list.value.filter((a) => a.id !== id)
    total.value--
  }

  function setFilter(category, tag) {
    selectedCategory.value = category || null
    selectedTag.value = tag || null
    currentPage.value = 1
  }

  function clearFilters() {
    selectedCategory.value = null
    selectedTag.value = null
    searchQuery.value = ''
    currentPage.value = 1
  }

  return {
    list, current, currentPage, pageSize, total,
    selectedCategory, selectedTag, searchQuery, loading,
    prevArticle, nextArticle,
    totalPages, hasPrevPage, hasNextPage,
    fetchList, fetchDetail, search, createArticle, updateArticle, deleteArticle,
    setFilter, clearFilters,
  }
})
