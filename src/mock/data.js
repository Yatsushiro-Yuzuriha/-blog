// ===== Client-side Mock Data (for production without backend) =====

export const users = [
  { id: 'u1', username: 'Admin', email: 'admin@blog.com', password: 'admin123', role: 'admin', avatar: '', bio: '博客管理员', createdAt: '2024-01-01' },
  { id: 'u2', username: 'Author', email: 'author@blog.com', password: 'author123', role: 'author', avatar: '', bio: '技术作者', createdAt: '2024-02-15' },
  { id: 'u3', username: 'Reader', email: 'reader@blog.com', password: 'reader123', role: 'reader', avatar: '', bio: '读者', createdAt: '2024-03-20' },
  { id: 'u4', username: 'DevZhang', email: 'zhang@blog.com', password: 'dev123456', role: 'reader', avatar: '', bio: '前端开发者', createdAt: '2024-04-10' },
  { id: 'u5', username: 'DesignLi', email: 'li@blog.com', password: 'design123', role: 'author', avatar: '', bio: 'UI 设计师', createdAt: '2024-05-05' },
  { id: 'u6', username: 'CodeWang', email: 'wang@blog.com', password: 'code123456', role: 'reader', avatar: '', bio: '全栈工程师', createdAt: '2024-06-20' },
]

export const categories = [
  { id: 1, name: '前端开发', slug: 'frontend' },
  { id: 2, name: '后端开发', slug: 'backend' },
  { id: 3, name: '设计思考', slug: 'design' },
  { id: 4, name: '技术教程', slug: 'tutorial' },
  { id: 5, name: '生活随笔', slug: 'life' },
  { id: 6, name: 'JavaScript', slug: 'javascript' },
  { id: 7, name: 'CSS', slug: 'css' },
  { id: 8, name: 'Vue', slug: 'vue' },
]

export const tags = [
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

const titles = [
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
]

const tagPool = ['Vue', 'JavaScript', 'TypeScript', 'CSS', 'Node.js', 'React', '性能优化', '设计模式', 'Git', 'DevOps', '算法', '架构', '工具', '前端工程化', '响应式设计']
const tagSlugs = ['vue', 'javascript', 'typescript', 'css', 'nodejs', 'react', 'performance', 'patterns', 'git', 'devops', 'algorithm', 'architecture', 'tools', 'engineering', 'responsive']

function makeContent(i) {
  return `## 前言\n\n这是第 ${i + 1} 篇文章的正文内容。在这篇文章中，我们将深入探讨相关主题。\n\n## 什么是核心技术\n\n核心技术是驱动现代 Web 应用的关键因素。理解这些概念对于构建高质量的应用至关重要。\n\n### 基本概念\n\n首先，让我们从最基本的概念开始：\n\n- **概念一**：这是第一个重要概念的解释\n- **概念二**：第二个概念涉及更深入的原理\n- **概念三**：第三个概念将前面的内容串联起来\n\n> 重要的引用：技术不仅仅是工具，更是一种思维方式。\n\n## 深入分析\n\n在实际开发中，我们经常会遇到以下场景：\n\n\`\`\`javascript\nfunction example() {\n  const data = {\n    name: 'blog',\n    version: '1.0.0',\n    description: 'A personal blog system'\n  }\n  return Object.keys(data).map(key => ({\n    key,\n    value: data[key]\n  }))\n}\n\`\`\`\n\n### 最佳实践\n\n1. **保持代码简洁**：简洁的代码更容易维护和理解\n2. **注重性能**：在开发过程中始终关注性能指标\n3. **持续学习**：技术领域变化迅速，保持学习的心态\n\n## 实际案例\n\n\`\`\`css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 1rem;\n  padding: 2rem;\n}\n\`\`\`\n\n### 性能对比\n\n| 方案 | 性能 | 复杂度 | 推荐度 |\n|------|------|--------|--------|\n| 方案 A | ⭐⭐⭐⭐⭐ | 中 | ✅ 推荐 |\n| 方案 B | ⭐⭐⭐ | 低 | ⚠️ 可选 |\n| 方案 C | ⭐⭐⭐⭐ | 高 | ❌ 不推荐 |\n\n## 总结\n\n通过本文的学习，我们了解了核心概念、最佳实践以及实际应用。希望这些内容能对你的开发工作有所帮助。\n\n记住：**实践出真知**。多写代码，多思考，才能不断进步。`
}

// Generate 35 articles
let _nextId = 36
export const articles = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  title: titles[i],
  slug: `article-${i + 1}`,
  excerpt: `这是文章 ${i + 1} 的摘要内容。摘要简洁地概括了文章的核心观点，让读者快速了解文章内容。`,
  content: makeContent(i),
  categoryId: (i % 8) + 1,
  tags: [
    { id: (i % 15) + 1, name: tagPool[i % 15], slug: tagSlugs[i % 15] },
    { id: ((i + 3) % 15) + 1, name: tagPool[(i + 3) % 15], slug: tagSlugs[(i + 3) % 15] },
  ],
  author: { id: i % 2 === 0 ? 'u1' : 'u2', username: i % 2 === 0 ? 'Admin' : 'Author', avatar: '' },
  readingTime: Math.floor(Math.random() * 15) + 3,
  viewCount: Math.floor(Math.random() * 5000) + 100,
  status: 'published',
  createdAt: new Date(Date.now() - (35 - i) * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - (35 - i) * 43200000).toISOString(),
}))

export function getNextArticleId() {
  return _nextId++
}
