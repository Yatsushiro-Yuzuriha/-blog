// ===== Categories API =====
import request from './request'

export const categoriesApi = {
  getList() {
    return request.get('/categories')
  },
}
