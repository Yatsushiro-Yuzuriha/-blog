const { success } = require('./_utils.cjs')

const categories = [
  { id: 1, name: '前端开发', slug: 'frontend' },
  { id: 2, name: '后端开发', slug: 'backend' },
  { id: 3, name: '设计思考', slug: 'design' },
  { id: 4, name: '技术教程', slug: 'tutorial' },
  { id: 5, name: '生活随笔', slug: 'life' },
  { id: 6, name: 'JavaScript', slug: 'javascript' },
  { id: 7, name: 'CSS', slug: 'css' },
  { id: 8, name: 'Vue', slug: 'vue' },
]

module.exports = [
  {
    url: '/api/categories',
    method: 'GET',
    response() {
      return success(categories)
    },
  },
]
