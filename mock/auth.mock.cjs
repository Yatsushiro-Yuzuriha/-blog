const { success, error, setUsers, registerToken, getUserByAuth } = require('./_utils.cjs')

const users = [
  { id: 'u1', username: 'Admin', email: 'admin@blog.com', password: 'admin123', role: 'admin', avatar: '', bio: '博客管理员', createdAt: '2024-01-01' },
  { id: 'u2', username: 'Author', email: 'author@blog.com', password: 'author123', role: 'author', avatar: '', bio: '技术作者', createdAt: '2024-02-15' },
  { id: 'u3', username: 'Reader', email: 'reader@blog.com', password: 'reader123', role: 'reader', avatar: '', bio: '读者', createdAt: '2024-03-20' },
]

// Share users with other mock modules so they can look up authors
setUsers(users)

// Local refresh→userId mapping
const refreshMap = {}

function safeUser(user) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

function makeTokens(userId) {
  const token = 'mock_token_' + userId + '_' + Date.now()
  const refreshToken = 'mock_refresh_' + userId + '_' + Date.now()
  registerToken(token, userId, refreshToken)
  refreshMap[refreshToken] = userId
  return { accessToken: token, refreshToken }
}

module.exports = [
  {
    url: '/api/auth/login',
    method: 'POST',
    response({ body }) {
      const { email, password } = body || {}
      const user = users.find((u) => u.email === email && u.password === password)
      if (!user) {
        return error('邮箱或密码错误')
      }
      const { accessToken, refreshToken } = makeTokens(user.id)
      return success({ user: safeUser(user), accessToken, refreshToken })
    },
  },
  {
    url: '/api/auth/register',
    method: 'POST',
    response({ body }) {
      const { username, email, password } = body || {}
      if (users.find((u) => u.email === email)) {
        return error('该邮箱已注册')
      }
      const newUser = {
        id: 'u' + (users.length + 1),
        username,
        email,
        password,
        role: 'reader',
        avatar: '',
        bio: '',
        createdAt: new Date().toISOString().split('T')[0],
      }
      users.push(newUser)
      setUsers(users) // refresh shared reference
      const { accessToken, refreshToken } = makeTokens(newUser.id)
      return success({ user: safeUser(newUser), accessToken, refreshToken })
    },
  },
  {
    url: '/api/auth/profile',
    method: 'GET',
    response({ headers }) {
      const user = getUserByAuth(headers?.authorization)
      if (!user) return error('未登录', 401)
      return success(user)
    },
  },
  {
    url: '/api/auth/refresh',
    method: 'POST',
    response({ body }) {
      const { refreshToken } = body || {}
      const userId = refreshMap[refreshToken]
      if (!userId) return error('Invalid refresh token', 401)
      const { accessToken } = makeTokens(userId)
      return success({ accessToken })
    },
  },
]
