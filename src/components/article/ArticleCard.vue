<template>
  <article class="article-card">
    <router-link :to="`/article/${article.id}`" class="article-card__link">
      <div class="article-card__meta">
        <span class="article-card__category">
          {{ categoryName }}
        </span>
        <span class="article-card__date">{{ formatDate(article.createdAt) }}</span>
        <span class="article-card__read">{{ article.readingTime }} 分钟阅读</span>
      </div>
      <h2 class="article-card__title">{{ article.title }}</h2>
      <p class="article-card__excerpt">{{ truncatedExcerpt }}</p>
      <div class="article-card__footer">
        <div class="article-card__tags">
          <BaseTag
            v-for="tag in article.tags"
            :key="tag.id"
            :label="tag.name"
            size="sm"
            variant="ghost"
          />
        </div>
        <span class="article-card__views">{{ article.viewCount }} 次阅读</span>
      </div>
    </router-link>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, truncateText } from '@/utils/format'
import { useCategoriesStore } from '@/stores/categories.store'
import BaseTag from '@/components/common/BaseTag.vue'

const props = defineProps({
  article: { type: Object, required: true },
})

const categoriesStore = useCategoriesStore()

const categoryName = computed(() => {
  const cat = categoriesStore.list.find((c) => c.id === props.article.categoryId)
  return cat ? cat.name : ''
})

const truncatedExcerpt = computed(() => truncateText(props.article.excerpt, 120))
</script>

<style lang="scss" scoped>
.article-card {
  border-bottom: 1px solid var(--color-border-light);
  transition: background var(--transition-fast);

  &__link {
    display: block;
    padding: var(--space-xl) 0;
    text-decoration: none;
    color: inherit;
  }

  &:hover {
    background: var(--color-bg-secondary);
    margin: 0 calc(-1 * var(--space-md));
    padding: 0 var(--space-md);
    border-radius: var(--radius-md);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-sm);
  }

  &__category {
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  &__title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    margin-bottom: var(--space-sm);
    letter-spacing: -0.01em;
  }

  &__excerpt {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--space-md);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  &__views {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    white-space: nowrap;
  }

  &__read {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
  }
}

@include mobile {
  .article-card {
    &__title { font-size: var(--font-size-xl); }
    &__meta { flex-wrap: wrap; gap: var(--space-sm); }
  }
}
</style>
