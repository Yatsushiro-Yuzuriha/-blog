<template>
  <div class="comment-manage">
    <div class="comment-manage__header">
      <h1 class="comment-manage__title">评论管理</h1>
      <p class="text-secondary">管理所有评论，可以删除不当评论。</p>
    </div>

    <BaseSpinner v-if="loading" />

    <template v-else-if="list.length > 0">
      <div class="comment-list">
        <div v-for="comment in list" :key="comment.id" class="comment-card">
          <div class="comment-card__meta">
            <span class="comment-card__author">{{ comment.author?.username || '匿名用户' }}</span>
            <span class="comment-card__article">
              文章 #{{ comment.articleId || comment._articleId }}
            </span>
            <span class="comment-card__date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="comment-card__content">{{ comment.content }}</p>
          <div class="comment-card__actions">
            <BaseButton variant="text" size="sm" @click="handleDelete(comment)">删除</BaseButton>
          </div>
        </div>
      </div>

      <BasePagination
        class="comment-manage__pagination"
        :current="currentPage"
        :total="totalPages"
        @change="handlePageChange"
      />
    </template>

    <BaseEmpty v-else message="暂无评论" icon="💬" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { commentsApi } from '@/api/comments.api'
import { formatDate } from '@/utils/format'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseSpinner from '@/components/common/BaseSpinner.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'

const list = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)

async function fetchData(page = 1) {
  loading.value = true
  try {
    const res = await commentsApi.getAll({ page, pageSize: 20 })
    list.value = res.list
    totalPages.value = res.totalPages
    currentPage.value = res.page
  } catch {
    list.value = []
  } finally {
    loading.value = false
  }
}

async function handleDelete(comment) {
  if (!confirm(`确定删除这条评论？\n\n"${comment.content.slice(0, 60)}..."`)) return
  try {
    await commentsApi.delete(comment.id)
    list.value = list.value.filter((c) => c.id !== comment.id)
  } catch (e) {
    alert(e.message || '删除失败')
  }
}

function handlePageChange(page) {
  fetchData(page)
}

onMounted(() => fetchData())
</script>

<style lang="scss" scoped>
.comment-manage {
  &__header {
    margin-bottom: var(--space-xl);
  }

  &__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-xs);
  }

  &__pagination {
    margin-top: var(--space-xl);
  }
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.comment-card {
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-sm);
  }

  &__author {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
  }

  &__article {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
  }

  &__date {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    margin-left: auto;
  }

  &__content {
    font-size: var(--font-size-base);
    color: var(--color-text);
    line-height: 1.6;
    margin-bottom: var(--space-sm);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
