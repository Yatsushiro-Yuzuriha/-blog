<template>
  <div class="dashboard">
    <h1 class="dashboard__title">仪表盘</h1>

    <div class="dashboard__stats">
      <div class="stat-card">
        <span class="stat-card__icon">📄</span>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ articleStats.total }}</span>
          <span class="stat-card__label">文章总数</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-card__icon">💬</span>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ commentStats.total }}</span>
          <span class="stat-card__label">评论总数</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-card__icon">👥</span>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ userStats.total }}</span>
          <span class="stat-card__label">用户总数</span>
        </div>
      </div>
    </div>

    <div class="dashboard__actions">
      <BaseButton to="/admin/articles/new" variant="primary">+ 写文章</BaseButton>
      <BaseButton to="/admin/articles" variant="ghost">管理文章</BaseButton>
      <BaseButton v-if="authStore.isAdmin" to="/admin/users" variant="ghost">管理用户</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { articlesApi } from '@/api/articles.api'
import { commentsApi } from '@/api/comments.api'
import { usersApi } from '@/api/users.api'
import BaseButton from '@/components/common/BaseButton.vue'

const authStore = useAuthStore()

const articleStats = ref({ total: 0 })
const commentStats = ref({ total: 0 })
const userStats = ref({ total: 0 })

onMounted(async () => {
  try {
    const articles = await articlesApi.getList({ page: 1, pageSize: 1 })
    articleStats.value = { total: articles.total }
  } catch {}
  try {
    const comments = await commentsApi.getAll({ page: 1, pageSize: 1 })
    commentStats.value = { total: comments.total }
  } catch {}
  try {
    const users = await usersApi.getList({ page: 1, pageSize: 1 })
    userStats.value = { total: users.total }
  } catch {}
})
</script>

<style lang="scss" scoped>
.dashboard {
  &__title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-2xl);
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
  }

  &__actions {
    display: flex;
    gap: var(--space-sm);
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);

  &__icon { font-size: 2rem; }
  &__body { display: flex; flex-direction: column; }
  &__value { font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); }
  &__label { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
}

@include tablet {
  .dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include mobile {
  .dashboard__stats {
    grid-template-columns: 1fr;
  }
}
</style>
