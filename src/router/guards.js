// ===== Navigation Guards =====
import { getItem } from '@/utils/storage'

/**
 * Guest guard: redirect authenticated users away from login/register
 */
export function guestGuard(to, from, next) {
  const token = getItem('access_token')
  if (token) {
    next({ name: 'Home' })
  } else {
    next()
  }
}

/**
 * Auth guard: redirect unauthenticated users to login
 */
export function authGuard(to, from, next) {
  const token = getItem('access_token')
  if (!token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

/**
 * Admin guard: check role-based access
 */
export function adminGuard(to, from, next) {
  const token = getItem('access_token')
  if (!token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Read user from localStorage (set during login via persistSession)
  try {
    const user = getItem('user')
    if (!user) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    const requiredRoles = to.meta.roles || []

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      // User doesn't have required role
      next({ name: 'Home' })
    } else {
      next()
    }
  } catch {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  }
}
