const { success } = require('./_utils.cjs')

const tags = [
  { id: 1, name: 'Vue', slug: 'vue' },
  { id: 2, name: 'JavaScript', slug: 'javascript' },
  { id: 3, name: 'TypeScript', slug: 'typescript' },
  { id: 4, name: 'CSS', slug: 'css' },
  { id: 5, name: 'Node.js', slug: 'nodejs' },
  { id: 6, name: 'React', slug: 'react' },
  { id: 7, name: '性能优化', slug: 'performance' },
  { id: 8, name: '设计模式', slug: 'patterns' },
  { id: 9, name: 'Git', slug: 'git' },
  { id: 10, name: 'DevOps', slug: 'devops' },
  { id: 11, name: '算法', slug: 'algorithm' },
  { id: 12, name: '架构', slug: 'architecture' },
  { id: 13, name: '工具', slug: 'tools' },
  { id: 14, name: '前端工程化', slug: 'engineering' },
  { id: 15, name: '响应式设计', slug: 'responsive' },
]

module.exports = [
  {
    url: '/api/tags',
    method: 'GET',
    response() {
      return success(tags)
    },
  },
]
