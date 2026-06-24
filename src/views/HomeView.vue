<template>
  <div class="home-view">
    <div class="home-view__header">
      <h1 class="home-view__title">文章</h1>
      <p class="home-view__subtitle">分享技术、设计与思考</p>
    </div>

    <div class="home-view__body">
      <!-- Sidebar: Categories & Tags -->
      <aside class="home-view__sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-section__title">分类</h3>
          <div class="sidebar-tags">
            <BaseTag
              :label="'全部'"
              :variant="!articlesStore.selectedCategory ? 'active' : 'default'"
              clickable
              size="sm"
              @click="filterByCategory(null)"
            />
            <BaseTag
              v-for="cat in categoriesStore.list"
              :key="cat.id"
              :label="cat.name"
              :variant="articlesStore.selectedCategory === cat.slug ? 'active' : 'default'"
              clickable
              size="sm"
              @click="filterByCategory(cat.slug)"
            />
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-section__title">标签</h3>
          <div class="sidebar-tags">
            <BaseTag
              v-for="tag in tagsStore.list"
              :key="tag.id"
              :label="tag.name"
              :variant="articlesStore.selectedTag === tag.slug ? 'active' : 'ghost'"
              clickable
              size="sm"
              @click="filterByTag(tag.slug)"
            />
          </div>
        </div>

        <!-- Active filter badge -->
        <div v-if="articlesStore.selectedCategory || articlesStore.selectedTag" class="sidebar-section">
          <BaseButton variant="text" size="sm" @click="clearFilters">清除筛选</BaseButton>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="home-view__content">
        <ArticleList
          :articles="articlesStore.list"
          :loading="articlesStore.loading"
          :current-page="articlesStore.currentPage"
          :total-pages="articlesStore.totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '@/stores/articles.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { useTagsStore } from '@/stores/tags.store'
import ArticleList from '@/components/article/ArticleList.vue'
import BaseTag from '@/components/common/BaseTag.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const articlesStore = useArticlesStore()
const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()

function filterByCategory(slug) {
  articlesStore.setFilter(slug, null)
  articlesStore.fetchList()
}

function filterByTag(slug) {
  articlesStore.setFilter(null, slug === articlesStore.selectedTag ? null : slug)
  articlesStore.fetchList()
}

function clearFilters() {
  articlesStore.clearFilters()
  articlesStore.fetchList()
}

function handlePageChange(page) {
  articlesStore.currentPage = page
  articlesStore.fetchList()
}

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchList(),
    tagsStore.fetchList(),
  ])
  // Check URL query params
  if (route.query.category) articlesStore.setFilter(route.query.category, null)
  if (route.query.tag) articlesStore.setFilter(null, route.query.tag)
  articlesStore.fetchList()
})
</script>

<style lang="scss" scoped>
.home-view {
  &__header {
    text-align: center;
    padding: var(--space-3xl) 0 var(--space-2xl);
  }

  &__title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.02em;
  }

  &__subtitle {
    color: var(--color-text-secondary);
    margin-top: var(--space-sm);
    font-size: var(--font-size-lg);
  }

  &__body {
    display: flex;
    gap: var(--space-2xl);
    align-items: flex-start;
  }

  &__sidebar {
    width: 240px;
    flex-shrink: 0;
    position: sticky;
    top: calc(var(--header-height) + var(--space-lg));
  }

  &__content {
    flex: 1;
    min-width: 0;
  }
}

.sidebar-section {
  margin-bottom: var(--space-xl);

  &__title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-sm);
  }
}

.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

@include tablet {
  .home-view__sidebar {
    display: none;
  }
}
</style>
