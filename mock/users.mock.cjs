const { success, paginate } = require('./_utils.cjs')

const users = [
  { id: 'u1', username: 'Admin', email: 'admin@blog.com', role: 'admin', avatar: '', bio: '博客管理员', createdAt: '2024-01-01' },
  { id: 'u2', username: 'Author', email: 'author@blog.com', role: 'author', avatar: '', bio: '技术作者', createdAt: '2024-02-15' },
  { id: 'u3', username: 'Reader', email: 'reader@blog.com', role: 'reader', avatar: '', bio: '读者', createdAt: '2024-03-20' },
  { id: 'u4', username: 'DevZhang', email: 'zhang@blog.com', role: 'reader', avatar: '', bio: '前端开发者', createdAt: '2024-04-10' },
  { id: 'u5', username: 'DesignLi', email: 'li@blog.com', role: 'author', avatar: '', bio: 'UI 设计师', createdAt: '2024-05-05' },
  { id: 'u6', username: 'CodeWang', email: 'wang@blog.com', role: 'reader', avatar: '', bio: '全栈工程师', createdAt: '2024-06-20' },
]

module.exports = [
  {
    url: '/api/users',
    method: 'GET',
    response({ query }) {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      return success(paginate(users, page, pageSize))
    },
  },
  {
    url: '/api/users/:id/role',
    method: 'PUT',
    response({ params, body }) {
      const user = users.find((u) => u.id === params.id)
      if (!user) return { code: -1, message: '用户不存在', data: null }
      user.role = body.role
      return success(user)
    },
  },
  {
    url: '/api/users/:id',
    method: 'DELETE',
    response({ params }) {
      const idx = users.findIndex((u) => u.id === params.id)
      if (idx === -1) return { code: -1, message: '用户不存在', data: null }
      users.splice(idx, 1)
      return success(null)
    },
  },
]
