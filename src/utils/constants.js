// ===== Application Constants =====

export const ROLES = {
  ADMIN: 'admin',
  AUTHOR: 'author',
  READER: 'reader',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: '管理员',
  [ROLES.AUTHOR]: '作者',
  [ROLES.READER]: '读者',
}

export const ARTICLE_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
}

export const ARTICLE_STATUS_LABELS = {
  [ARTICLE_STATUS.PUBLISHED]: '已发布',
  [ARTICLE_STATUS.DRAFT]: '草稿',
}

export const PAGE_SIZE = 10

export const TOAST_DURATION = 3000 // ms
