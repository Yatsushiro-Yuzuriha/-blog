// ===== Tags API =====
import request from './request'

export const tagsApi = {
  getList() {
    return request.get('/tags')
  },
}
