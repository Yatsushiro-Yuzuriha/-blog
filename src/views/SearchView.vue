<template>
  <div class="search-view">
    <div class="search-view__header">
      <h1 class="search-view__title">搜索</h1>
      <form class="search-view__form" @submit.prevent="doSearch">
        <div class="search-input-wrapper">
          <input
            v-model="query"
            type="search"
            class="search-view__input"
            placeholder="搜索文章..."
            @input="onInput"
          />
          <BaseButton type="submit" size="md" :loading="articlesStore.loading">搜索</BaseButton>
        </div>
      </form>
    </div>

    <div class="search-view__results">
      <p v-if="articlesStore.searchQuery" class="search-view__info">
        搜索 "{{ articlesStore.searchQuery }}" 找到 {{ articlesStore.total }} 篇文章
      </p>

      <ArticleList
        :articles="articlesStore.list"
        :loading="articlesStore.loading"
        :current-page="articlesStore.currentPage"
        :total-pages="articlesStore.totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/stores/articles.store'
import ArticleList from '@/components/article/ArticleList.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

const query = ref(route.query.q || '')
let debounceTimer = null

function onInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(doSearch, 500)
}

function doSearch() {
  if (!query.value.trim()) return
  router.replace({ query: { q: query.value } })
  articlesStore.search(query.value).catch(() => {})
}

function handlePageChange(page) {
  articlesStore.search(articlesStore.searchQuery, page).catch(() => {})
}

// Initial search from URL
if (route.query.q) {
  query.value = route.query.q
  articlesStore.search(route.query.q).catch(() => {})
}
</script>

<style lang="scss" scoped>
.search-view {
  &__header {
    text-align: center;
    padding: var(--space-3xl) 0 var(--space-2xl);
  }

  &__title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-xl);
  }

  &__form {
    max-width: 560px;
    margin: 0 auto;
  }

  &__input {
    flex: 1;
    height: 48px;
    padding: 0 var(--space-md);
    font-size: var(--font-size-base);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);

    &::placeholder {
      color: var(--color-text-tertiary);
    }

    &:focus {
      outline: none;
      border-color: var(--color-text);
    }
  }

  &__info {
    text-align: center;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-lg);
  }

  &__results {
    max-width: var(--max-width-content);
    margin: 0 auto;
  }
}

.search-input-wrapper {
  display: flex;
  gap: var(--space-sm);
}
</style>
