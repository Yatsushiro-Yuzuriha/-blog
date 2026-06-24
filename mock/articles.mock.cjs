const { success, paginate, now, getUserByAuth } = require('./_utils.cjs')

const articles = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  title: [
    'Vue 3 Composition API 深入理解与实践',
    'JavaScript 异步编程：从回调到 async/await',
    'CSS Grid 布局完全指南',
    'Node.js 性能优化实战技巧',
    'TypeScript 高级类型系统详解',
    '前端工程化：从 Webpack 到 Vite',
    'React Hooks 原理与最佳实践',
    '响应式设计：从移动端优先到断点策略',
    'Git 工作流最佳实践',
    '前端安全防护指南',
    '微前端架构设计与实施',
    'Web 性能监控与优化',
    '设计模式在前端的应用',
    'GraphQL 入门与实战',
    'Docker 容器化前端部署',
    '函数式编程思维',
    'WebAssembly 前端新范式',
    '前端测试策略与实践',
    '浏览器渲染原理深度解析',
    '状态管理方案对比',
    'Serverless 前端应用开发',
    'Web Components 标准与实践',
    '前端日志与错误追踪',
    'CSS 动画与过渡效果',
    'PWA 渐进式 Web 应用开发',
    '前端构建工具链演进',
    'Monorepo 项目管理实践',
    'WebSocket 实时通信',
    '前端国际化方案',
    '代码可读性与重构技巧',
    '浏览器的故事：从 Netscape 到 Chrome',
    '如何写出整洁的代码',
    '程序员的软技能修炼',
    '远程办公的一年：效率与生活平衡',
    '2024 前端技术趋势总结',
  ][i % 35],
  slug: `article-${i + 1}`,
  excerpt: `这是文章 ${i + 1} 的摘要内容。摘要简洁地概括了文章的核心观点，让读者快速了解文章内容。`,
  content: generateContent(i),
  categoryId: (i % 8) + 1,
  tags: [
    { id: (i % 15) + 1, name: ['Vue', 'JavaScript', 'TypeScript', 'CSS', 'Node.js', 'React', '性能优化', '设计模式', 'Git', 'DevOps', '算法', '架构', '工具', '前端工程化', '响应式设计'][i % 15], slug: ['vue', 'javascript', 'typescript', 'css', 'nodejs', 'react', 'performance', 'patterns', 'git', 'devops', 'algorithm', 'architecture', 'tools', 'engineering', 'responsive'][i % 15] },
    { id: ((i + 3) % 15) + 1, name: ['Vue', 'JavaScript', 'TypeScript', 'CSS', 'Node.js', 'React', '性能优化', '设计模式', 'Git', 'DevOps', '算法', '架构', '工具', '前端工程化', '响应式设计'][(i + 3) % 15], slug: ['vue', 'javascript', 'typescript', 'css', 'nodejs', 'react', 'performance', 'patterns', 'git', 'devops', 'algorithm', 'architecture', 'tools', 'engineering', 'responsive'][(i + 3) % 15] },
  ],
  author: { id: i % 2 === 0 ? 'u1' : 'u2', username: i % 2 === 0 ? 'Admin' : 'Author', avatar: '' },
  readingTime: Math.floor(Math.random() * 15) + 3,
  viewCount: Math.floor(Math.random() * 5000) + 100,
  status: 'published',
  createdAt: new Date(Date.now() - (35 - i) * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - (35 - i) * 43200000).toISOString(),
}))

// Track next article ID for new articles
let nextId = 36

function generateContent(i) {
  return `## 前言\n\n这是第 ${i + 1} 篇文章的正文内容。在这篇文章中，我们将深入探讨相关主题。\n\n## 什么是核心技术\n\n核心技术是驱动现代 Web 应用的关键因素。理解这些概念对于构建高质量的应用至关重要。\n\n### 基本概念\n\n首先，让我们从最基本的概念开始：\n\n- **概念一**：这是第一个重要概念的解释\n- **概念二**：第二个概念涉及更深入的原理\n- **概念三**：第三个概念将前面的内容串联起来\n\n> 重要的引用：技术不仅仅是工具，更是一种思维方式。 —— 某位知名开发者\n\n## 深入分析\n\n在实际开发中，我们经常会遇到以下场景：\n\n\`\`\`javascript\nfunction example() {\n  const data = {\n    name: 'blog',\n    version: '1.0.0',\n    description: 'A personal blog system'\n  }\n  return Object.keys(data).map(key => ({\n    key,\n    value: data[key]\n  }))\n}\nconsole.log(example())\n\`\`\`\n\n### 最佳实践\n\n1. **保持代码简洁**：简洁的代码更容易维护和理解\n2. **注重性能**：在开发过程中始终关注性能指标\n3. **持续学习**：技术领域变化迅速，保持学习的心态\n\n## 实际案例\n\n下面通过一个实际案例来说明这些概念：\n\n\`\`\`css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 1rem;\n  padding: 2rem;\n}\n\`\`\`\n\n### 性能对比\n\n| 方案 | 性能 | 复杂度 | 推荐度 |\n|------|------|--------|--------|\n| 方案 A | ⭐⭐⭐⭐⭐ | 中 | ✅ 推荐 |\n| 方案 B | ⭐⭐⭐ | 低 | ⚠️ 可选 |\n| 方案 C | ⭐⭐⭐⭐ | 高 | ❌ 不推荐 |\n\n## 总结\n\n通过本文的学习，我们了解了核心概念、最佳实践以及实际应用。希望这些内容能对你的开发工作有所帮助。\n\n记住：**实践出真知**。多写代码，多思考，才能不断进步。`
}

/**
 * Check if a user can modify an article.
 * Admin can modify all; author can only modify their own; reader can modify none.
 */
function canModify(user, article) {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role === 'author' && article.author && article.author.id === user.id) return true
  return false
}

module.exports = [
  // ---- List articles (public: only published; admin: all with ?status=all) ----
  {
    url: '/api/articles',
    method: 'GET',
    response({ query, headers }) {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10

      // If status=all is passed, return all articles including drafts
      const showAll = query.status === 'all'
      let filtered = showAll
        ? [...articles]
        : articles.filter((a) => a.status === 'published')

      if (query.category) {
        const catId = parseInt(query.category)
        if (!isNaN(catId)) filtered = filtered.filter((a) => a.categoryId === catId)
      }

      return success(paginate(filtered, page, pageSize))
    },
  },

  // ---- Search articles (public: only published) ----
  {
    url: '/api/articles/search',
    method: 'GET',
    response({ query }) {
      const q = (query.q || '').toLowerCase()
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      let filtered = articles.filter(
        (a) =>
          a.status === 'published' &&
          (a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.content.toLowerCase().includes(q))
      )
      return success(paginate(filtered, page, pageSize))
    },
  },

  // ---- Get single article ----
  {
    url: '/api/articles/:id',
    method: 'GET',
    response({ params }) {
      const article = articles.find((a) => a.id === parseInt(params.id))
      if (!article) return { code: -1, message: '文章不存在', data: null }
      return success(article)
    },
  },

  // ---- Prev / Next navigation ----
  {
    url: '/api/articles/:id/nav',
    method: 'GET',
    response({ params }) {
      const published = articles.filter((a) => a.status === 'published')
      const idx = published.findIndex((a) => a.id === parseInt(params.id))
      const prev = idx > 0 ? published[idx - 1] : null
      const next = idx < published.length - 1 ? published[idx + 1] : null
      const pick = (a) => (a ? { id: a.id, title: a.title, slug: a.slug } : null)
      return success({ prev: pick(prev), next: pick(next) })
    },
  },

  // ---- Create article ----
  {
    url: '/api/articles',
    method: 'POST',
    response({ body, headers }) {
      const currentUser = getUserByAuth(headers?.authorization)
      if (!currentUser) return { code: -1, message: '请先登录', data: null }

      const author = { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar || '' }
      const newArticle = {
        id: nextId++,
        title: body.title,
        slug: 'article-' + nextId,
        excerpt: body.excerpt || (body.content || '').slice(0, 100) + '...',
        content: body.content || '',
        categoryId: body.categoryId || 1,
        tags: body.tags || [],
        author,
        readingTime: Math.ceil((body.content || '').length / 400),
        viewCount: 0,
        status: body.status || 'draft',
        createdAt: now(),
        updatedAt: now(),
      }
      articles.unshift(newArticle)
      return success(newArticle)
    },
  },

  // ---- Update article ----
  {
    url: '/api/articles/:id',
    method: 'PUT',
    response({ params, body, headers }) {
      const currentUser = getUserByAuth(headers?.authorization)
      if (!currentUser) return { code: -1, message: '请先登录', data: null }

      const idx = articles.findIndex((a) => a.id === parseInt(params.id))
      if (idx === -1) return { code: -1, message: '文章不存在', data: null }

      // Permission check: admin can edit all; author can only edit own articles
      if (!canModify(currentUser, articles[idx])) {
        return { code: -1, message: '无权限编辑此文章', data: null }
      }

      articles[idx] = { ...articles[idx], ...body, updatedAt: now() }
      return success(articles[idx])
    },
  },

  // ---- Delete article ----
  {
    url: '/api/articles/:id',
    method: 'DELETE',
    response({ params, headers }) {
      const currentUser = getUserByAuth(headers?.authorization)
      if (!currentUser) return { code: -1, message: '请先登录', data: null }

      const idx = articles.findIndex((a) => a.id === parseInt(params.id))
      if (idx === -1) return { code: -1, message: '文章不存在', data: null }

      // Permission check: admin can delete all; author can only delete own articles
      if (!canModify(currentUser, articles[idx])) {
        return { code: -1, message: '无权限删除此文章', data: null }
      }

      articles.splice(idx, 1)
      return success(null)
    },
  },
]
