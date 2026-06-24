// ===== Form Validation Rules =====

export function validateEmail(email) {
  if (!email || !email.trim()) return '请输入邮箱地址'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return '请输入有效的邮箱地址'
  return ''
}

export function validatePassword(password) {
  if (!password) return '请输入密码'
  if (password.length < 6) return '密码至少需要 6 位'
  if (password.length > 50) return '密码不能超过 50 位'
  return ''
}

export function validateUsername(username) {
  if (!username || !username.trim()) return '请输入用户名'
  if (username.length < 2) return '用户名至少需要 2 个字符'
  if (username.length > 30) return '用户名不能超过 30 个字符'
  if (!/^[a-zA-Z0-9_一-鿿]+$/.test(username)) return '用户名只能包含中文、英文、数字和下划线'
  return ''
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return '请确认密码'
  if (password !== confirmPassword) return '两次输入的密码不一致'
  return ''
}

export function validateRequired(value, label = '此项') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${label}不能为空`
  }
  return ''
}
