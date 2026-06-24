// ===== Mock Utilities =====

function success(data) {
  return { code: 0, message: 'success', data }
}

function error(message = 'Error', code = -1) {
  return { code, message, data: null }
}

function paginate(list, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)
  return {
    list: items,
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

// ===== Shared token → user lookup =====
// This map is populated by auth.mock.cjs on login/register.
// Key: access token string, Value: { userId, refreshToken }
const _tokenStore = {}

// Shared users reference (set by auth.mock.cjs)
let _users = []

function setUsers(users) {
  _users = users
}

function registerToken(token, userId, refreshToken) {
  _tokenStore[token] = { userId, refreshToken }
}

/**
 * Given an Authorization header value ("Bearer <token>"),
 * return the matching user object (without password) or null.
 */
function getUserByAuth(authHeader) {
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const entry = _tokenStore[token]
  if (!entry) return null
  const user = _users.find((u) => u.id === entry.userId)
  if (!user) return null
  const { password, ...safe } = user
  return safe
}

module.exports = { success, error, paginate, randomId, now, setUsers, registerToken, getUserByAuth }
