// ===== Auth API =====
import request from './request'

export const authApi = {
  login(data) {
    return request.post('/auth/login', data)
  },

  register(data) {
    return request.post('/auth/register', data)
  },

  getProfile() {
    return request.get('/auth/profile')
  },

  refreshToken(refreshToken) {
    return request.post('/auth/refresh', { refreshToken })
  },
}
