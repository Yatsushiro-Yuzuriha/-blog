// ===== Formatting Utilities =====

/**
 * Format date string to readable format
 */
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  try {
    return date.toLocaleDateString('zh-CN', { ...defaultOptions, ...options })
  } catch {
    return dateStr
  }
}

/**
 * Format relative time (e.g., "3天前", "刚刚")
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return ''

  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 30) return `${days} 天前`
  if (months < 12) return `${months} 个月前`
  return `${years} 年前`
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(text) {
  if (!text) return 1

  // Average Chinese reading speed: ~400 chars/min
  // Average English reading speed: ~200 words/min
  const chineseChars = (text.match(/[一-鿿]/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length

  const minutes = Math.ceil(chineseChars / 400 + englishWords / 200)
  return Math.max(1, minutes)
}

/**
 * Truncate text to given length
 */
export function truncateText(text, maxLength = 150) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}
