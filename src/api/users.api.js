// ===== Users API (Admin) =====
import request from './request'

export const usersApi = {
  getList(params) {
    return request.get('/users', { params })
  },

  updateRole(userId, role) {
    return request.put(`/users/${userId}/role`, { role })
  },

  delete(userId) {
    return request.delete(`/users/${userId}`)
  },
}
