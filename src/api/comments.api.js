// ===== Comments API =====
import request from './request'

export const commentsApi = {
  getList(articleId) {
    return request.get(`/articles/${articleId}/comments`)
  },

  getAll(params) {
    return request.get('/comments', { params })
  },

  create(articleId, data) {
    return request.post(`/articles/${articleId}/comments`, data)
  },

  delete(commentId) {
    return request.delete(`/comments/${commentId}`)
  },
}
