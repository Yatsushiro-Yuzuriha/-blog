// ===== Articles API =====
import request from './request'

export const articlesApi = {
  getList(params) {
    return request.get('/articles', { params })
  },

  getDetail(id) {
    return request.get(`/articles/${id}`)
  },

  getPrevNext(id) {
    return request.get(`/articles/${id}/nav`)
  },

  search(q, page = 1, pageSize = 10) {
    return request.get('/articles/search', { params: { q, page, pageSize } })
  },

  create(data) {
    return request.post('/articles', data)
  },

  update(id, data) {
    return request.put(`/articles/${id}`, data)
  },

  delete(id) {
    return request.delete(`/articles/${id}`)
  },
}
