<template>
  <div class="article-meta">
    <div class="article-meta__info">
      <span class="article-meta__author">
        {{ article.author?.username || '匿名' }}
      </span>
      <span class="article-meta__sep">·</span>
      <span>{{ formatDate(article.createdAt) }}</span>
      <span class="article-meta__sep">·</span>
      <span>{{ article.readingTime }} 分钟阅读</span>
      <span class="article-meta__sep">·</span>
      <span>{{ article.viewCount }} 次阅读</span>
    </div>
    <div v-if="article.tags?.length" class="article-meta__tags">
      <BaseTag
        v-for="tag in article.tags"
        :key="tag.id"
        :label="tag.name"
        variant="ghost"
        size="sm"
      />
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils/format'
import BaseTag from '@/components/common/BaseTag.vue'

defineProps({
  article: { type: Object, required: true },
})
</script>

<style lang="scss" scoped>
.article-meta {
  margin-bottom: var(--space-2xl);

  &__info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-md);
  }

  &__author {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
  }

  &__sep {
    color: var(--color-text-tertiary);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }
}
</style>
