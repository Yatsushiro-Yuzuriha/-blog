// ===== Comments Store =====
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { commentsApi } from '@/api/comments.api'

export const useCommentsStore = defineStore('comments', () => {
  const comments = ref([])
  const articleId = ref(null)
  const loading = ref(false)

  async function fetchList(aid) {
    articleId.value = aid
    loading.value = true
    try {
      comments.value = await commentsApi.getList(aid)
    } finally {
      loading.value = false
    }
  }

  async function create(articleId, data) {
    const newComment = await commentsApi.create(articleId, data)
    // Add to top of list
    if (data.parentId) {
      // Reply: insert after parent
      const parentIdx = comments.value.findIndex((c) => c.id === data.parentId)
      if (parentIdx > -1) {
        comments.value.splice(parentIdx + 1, 0, newComment)
      } else {
        comments.value.unshift(newComment)
      }
    } else {
      comments.value.unshift(newComment)
    }
  }

  async function remove(commentId) {
    await commentsApi.delete(commentId)
    comments.value = comments.value.filter((c) => c.id !== commentId)
  }

  return { comments, articleId, loading, fetchList, create, remove }
})
