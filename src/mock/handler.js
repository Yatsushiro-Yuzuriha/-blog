// ===== Client-side Mock Handler =====
// Intercepts axios requests and returns mock data in the browser.
// Enables the blog to work on GitHub Pages without a real backend.
import { articles, categories, tags, users, getNextArticleId } from './data'

// ---- helpers ----
function ok(data) {
  return { code: 0, message: 'success', data }
}

function fail(message, code = -1) {
  return { code, message, data: null }
}

function paginate(list, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
    totalPages: Math.ceil(list.length / pageSize),
  }
}

function randomId() {
  return Math.random().toString(36).substring(2, 10)
}

function now() {
  return new Date().toISOString()
}

// ---- State ----
const tokenStore = {}     // token -> userId
const refreshMap = {}     // refreshToken -> userId
const comments = {}

// Pre-seed comments
const SEED_ARTICLES = [1, 2, 3, 4, 5, 10, 15, 20, 25]
const SEED_AUTHORS = [
  { id: 'u3', username: 'Reader', avatar: '' },
  { id: 'u2', username: 'Author', avatar: '' },
  { id: 'u1', username: 'Admin', avatar: '' },
]
const SEED_TEXTS = [
  '文章写得很棒，受益匪浅！',
  '期待更多这样的技术分享 👍',
  '感谢支持！会继续更新的。',
  '这个知识点讲解得很透彻，学习了。',
  '请问有计划出续集吗？',
  '收藏了，慢慢看。',
]
SEED_ARTICLES.forEach((articleId) => {
  comments[articleId] = [
    { id: randomId(), articleId, content: SEED_TEXTS[0], author: SEED_AUTHORS[0], parentId: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: randomId(), articleId, content: SEED_TEXTS[1], author: SEED_AUTHORS[1], parentId: null, createdAt: new Date(Date.now() - 43200000).toISOString() },
    { id: randomId(), articleId, content: SEED_TEXTS[2], author: SEED_AUTHORS[2], parentId: null, createdAt: new Date(Date.now() - 21600000).toISOString() },
  ]
})

function safeUser(u) {
  if (!u) return null
  const { password, ...rest } = u
  return rest
}

function getUserByToken(token) {
  const entry = tokenStore[token]
  if (!entry) return null
  const user = users.find((u) => u.id === entry.userId)
  return user ? safeUser(user) : null
}

function canModifyArticle(user, article) {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role === 'author' && article.author && article.author.id === user.id) return true
  return false
}

// ---- URL matching ----
function matchRoute(pattern, url) {
  const parts = pattern.split('/')
  const actual = url.split('/')
  if (parts.length !== actual.length) return null
  const params = {}
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith(':')) {
      params[parts[i].slice(1)] = actual[i]
    } else if (parts[i] !== actual[i]) {
      return null
    }
  }
  return params
}

// ---- Main handler ----
export function handleMockRequest(config) {
  const url = new URL(config.url, config.baseURL ? config.baseURL : window.location.origin)
  const method = (config.method || 'GET').toUpperCase()
  const pathname = url.pathname
  const query = Object.fromEntries(url.searchParams)
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : null
  const authHeader = config.headers?.Authorization || config.headers?.authorization
  const token = authHeader ? authHeader.replace('Bearer ', '') : null
  const currentUser = token ? getUserByToken(token) : null

  let result

  // ---- Auth ----
  if (pathname === '/api/auth/login' && method === 'POST') {
    const user = users.find((u) => u.email === body?.email && u.password === body?.password)
    if (!user) { result = fail('邮箱或密码错误') } else {
      const accessToken = 'mock_token_' + user.id + '_' + Date.now()
      const refreshToken = 'mock_refresh_' + user.id + '_' + Date.now()
      tokenStore[accessToken] = { userId: user.id, refreshToken }
      refreshMap[refreshToken] = user.id
      result = ok({ user: safeUser(user), accessToken, refreshToken })
    }
  }
  else if (pathname === '/api/auth/register' && method === 'POST') {
    if (users.find((u) => u.email === body?.email)) { result = fail('该邮箱已注册') } else {
      const newUser = {
        id: 'u' + (users.length + 1),
        username: body?.username,
        email: body?.email,
        password: body?.password,
        role: 'reader', avatar: '', bio: '',
        createdAt: new Date().toISOString().split('T')[0],
      }
      users.push(newUser)
      const accessToken = 'mock_token_' + newUser.id + '_' + Date.now()
      const refreshToken = 'mock_refresh_' + newUser.id + '_' + Date.now()
      tokenStore[accessToken] = { userId: newUser.id, refreshToken }
      refreshMap[refreshToken] = newUser.id
      result = ok({ user: safeUser(newUser), accessToken, refreshToken })
    }
  }
  else if (pathname === '/api/auth/profile' && method === 'GET') {
    result = currentUser ? ok(currentUser) : fail('未登录', 401)
  }
  else if (pathname === '/api/auth/refresh' && method === 'POST') {
    const userId = refreshMap[body?.refreshToken]
    if (!userId) { result = fail('Invalid refresh token', 401) } else {
      const accessToken = 'mock_token_' + userId + '_' + Date.now()
      const refreshToken = 'mock_refresh_' + userId + '_' + Date.now()
      tokenStore[accessToken] = { userId, refreshToken }
      refreshMap[refreshToken] = userId
      result = ok({ accessToken })
    }
  }

  // ---- Categories ----
  else if (pathname === '/api/categories' && method === 'GET') {
    result = ok(categories)
  }

  // ---- Tags ----
  else if (pathname === '/api/tags' && method === 'GET') {
    result = ok(tags)
  }

  // ---- Articles list ----
  else if (pathname === '/api/articles' && method === 'GET') {
    const showAll = query.status === 'all'
    let filtered = showAll ? [...articles] : articles.filter((a) => a.status === 'published')
    if (query.category) {
      const catId = parseInt(query.category)
      if (!isNaN(catId)) filtered = filtered.filter((a) => a.categoryId === catId)
    }
    if (query.tag) {
      filtered = filtered.filter((a) => a.tags?.some((t) => t.slug === query.tag))
    }
    const page = parseInt(query.page) || 1
    const pageSize = parseInt(query.pageSize) || 10
    result = ok(paginate(filtered, page, pageSize))
  }

  // ---- Article search ----
  else if (pathname === '/api/articles/search' && method === 'GET') {
    const q = (query.q || '').toLowerCase()
    let filtered = articles.filter((a) =>
      a.status === 'published' &&
      (a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.content.toLowerCase().includes(q))
    )
    const page = parseInt(query.page) || 1
    const pageSize = parseInt(query.pageSize) || 10
    result = ok(paginate(filtered, page, pageSize))
  }

  // ---- Article detail ----
  else if (method === 'GET') {
    let m = matchRoute('/api/articles/:id/nav', pathname)
    if (m) {
      const published = articles.filter((a) => a.status === 'published')
      const idx = published.findIndex((a) => a.id === parseInt(m.id))
      const pick = (a) => (a ? { id: a.id, title: a.title, slug: a.slug } : null)
      result = ok({ prev: pick(published[idx - 1]), next: pick(published[idx + 1]) })
    }
    m = matchRoute('/api/articles/:articleId/comments', pathname)
    if (m) {
      const list = comments[parseInt(m.articleId)] || []
      result = ok(list)
    }
    m = matchRoute('/api/articles/:id', pathname)
    if (m) {
      const article = articles.find((a) => a.id === parseInt(m.id))
      result = article ? ok(article) : fail('文章不存在')
    }
  }

  // ---- Article create ----
  else if (pathname === '/api/articles' && method === 'POST') {
    if (!currentUser) { result = fail('请先登录') } else {
      const newArticle = {
        id: getNextArticleId(),
        title: body.title,
        slug: 'article-' + getNextArticleId(),
        excerpt: body.excerpt || (body.content || '').slice(0, 100) + '...',
        content: body.content || '',
        categoryId: body.categoryId || 1,
        tags: body.tags || [],
        author: { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar || '' },
        readingTime: Math.ceil((body.content || '').length / 400),
        viewCount: 0,
        status: body.status || 'draft',
        createdAt: now(),
        updatedAt: now(),
      }
      articles.unshift(newArticle)
      result = ok(newArticle)
    }
  }

  // ---- Article update ----
  else if (method === 'PUT') {
    let m = matchRoute('/api/articles/:id', pathname)
    if (m) {
      if (!currentUser) { result = fail('请先登录') } else {
        const idx = articles.findIndex((a) => a.id === parseInt(m.id))
        if (idx === -1) { result = fail('文章不存在') }
        else if (!canModifyArticle(currentUser, articles[idx])) { result = fail('无权限编辑此文章') }
        else {
          articles[idx] = { ...articles[idx], ...body, updatedAt: now() }
          result = ok(articles[idx])
        }
      }
    }
    m = matchRoute('/api/users/:id/role', pathname)
    if (m) {
      const user = users.find((u) => u.id === m.id)
      if (!user) { result = fail('用户不存在') } else {
        user.role = body.role
        result = ok(user)
      }
    }
  }

  // ---- Article delete ----
  else if (method === 'DELETE') {
    let m = matchRoute('/api/articles/:id', pathname)
    if (m) {
      if (!currentUser) { result = fail('请先登录') } else {
        const idx = articles.findIndex((a) => a.id === parseInt(m.id))
        if (idx === -1) { result = fail('文章不存在') }
        else if (!canModifyArticle(currentUser, articles[idx])) { result = fail('无权限删除此文章') }
        else { articles.splice(idx, 1); result = ok(null) }
      }
    }
    m = matchRoute('/api/comments/:id', pathname)
    if (m) {
      for (const key of Object.keys(comments)) {
        const idx = comments[key].findIndex((c) => c.id === m.id)
        if (idx > -1) { comments[key].splice(idx, 1); result = ok(null); break }
      }
      if (!result) result = fail('评论不存在')
    }
    m = matchRoute('/api/users/:id', pathname)
    if (m) {
      const idx = users.findIndex((u) => u.id === m.id)
      if (idx === -1) { result = fail('用户不存在') } else { users.splice(idx, 1); result = ok(null) }
    }
  }

  // ---- Comment create ----
  else if (method === 'POST') {
    const m = matchRoute('/api/articles/:articleId/comments', pathname)
    if (m) {
      const author = currentUser
        ? { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar || '' }
        : { id: 'anonymous', username: '匿名用户', avatar: '' }
      const list = comments[parseInt(m.articleId)] || (comments[parseInt(m.articleId)] = [])
      const newComment = {
        id: randomId(), articleId: parseInt(m.articleId), content: body.content,
        author, parentId: body.parentId || null, replyTo: body.replyTo || null, createdAt: now(),
      }
      list.unshift(newComment)
      result = ok(newComment)
    }
  }

  // ---- Comments list (admin) ----
  else if (pathname === '/api/comments' && method === 'GET') {
    const all = []
    for (const articleId of Object.keys(comments)) {
      for (const c of comments[articleId]) { all.push({ ...c, _articleId: articleId }) }
    }
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const page = parseInt(query.page) || 1
    const pageSize = parseInt(query.pageSize) || 20
    result = ok(paginate(all, page, pageSize))
  }

  // ---- Users list (admin) ----
  else if (pathname === '/api/users' && method === 'GET') {
    const page = parseInt(query.page) || 1
    const pageSize = parseInt(query.pageSize) || 10
    result = ok(paginate(users.map(safeUser), page, pageSize))
  }

  if (result) {
    return [200, result]
  }

  // fallback — shouldn't reach here
  return [404, fail('Not found: ' + pathname)]
}
