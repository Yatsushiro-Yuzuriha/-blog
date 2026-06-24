const { success, randomId, now, getUserByAuth, paginate } = require('./_utils.cjs')

const comments = {}

// Pre-seed comments for several articles so dashboard count is realistic
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

function ensureComments(articleId) {
  if (!comments[articleId]) {
    comments[articleId] = [
      { id: randomId(), articleId, content: SEED_TEXTS[0], author: SEED_AUTHORS[0], parentId: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: randomId(), articleId, content: SEED_TEXTS[1], author: SEED_AUTHORS[1], parentId: null, createdAt: new Date(Date.now() - 43200000).toISOString() },
      { id: randomId(), articleId, content: SEED_TEXTS[2], author: SEED_AUTHORS[2], parentId: null, createdAt: new Date(Date.now() - 21600000).toISOString() },
    ]
  }
  return comments[articleId]
}

// Pre-seed on module load
SEED_ARTICLES.forEach((id) => ensureComments(id))

function getAllComments() {
  const all = []
  for (const articleId of Object.keys(comments)) {
    for (const c of comments[articleId]) {
      all.push({ ...c, _articleId: articleId })
    }
  }
  // Sort by newest first
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return all
}

module.exports = [
  // ---- List all comments (admin) ----
  {
    url: '/api/comments',
    method: 'GET',
    response({ query }) {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 20
      const all = getAllComments()
      return success(paginate(all, page, pageSize))
    },
  },
  {
    url: '/api/articles/:articleId/comments',
    method: 'GET',
    response({ params }) {
      const list = ensureComments(params.articleId)
      return success(list)
    },
  },
  {
    url: '/api/articles/:articleId/comments',
    method: 'POST',
    response({ params, body, headers }) {
      // Use the real logged-in user from the Authorization header
      const currentUser = getUserByAuth(headers?.authorization)
      const author = currentUser
        ? { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar || '' }
        : { id: 'anonymous', username: '匿名用户', avatar: '' }

      const list = ensureComments(params.articleId)
      const newComment = {
        id: randomId(),
        articleId: params.articleId,
        content: body.content,
        author,
        parentId: body.parentId || null,
        replyTo: body.replyTo || null,
        createdAt: now(),
      }
      list.unshift(newComment)
      return success(newComment)
    },
  },
  {
    url: '/api/comments/:id',
    method: 'DELETE',
    response({ params }) {
      for (const key of Object.keys(comments)) {
        const idx = comments[key].findIndex((c) => c.id === params.id)
        if (idx > -1) {
          comments[key].splice(idx, 1)
          return success(null)
        }
      }
      return { code: -1, message: '评论不存在', data: null }
    },
  },
]
