<template>
  <div class="article-manage">
    <div class="article-manage__header">
      <h1>文章管理</h1>
      <BaseButton to="/admin/articles/new">+ 新建文章</BaseButton>
    </div>

    <BaseSpinner v-if="loading" />

    <template v-else-if="list.length > 0">
      <div class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>作者</th>
              <th>状态</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in list" :key="article.id">
              <td class="admin-table__title">{{ article.title }}</td>
              <td>{{ article.author?.username }}</td>
              <td>
                <BaseTag
                  :label="article.status === 'published' ? '已发布' : '草稿'"
                  :variant="article.status === 'published' ? 'active' : 'ghost'"
                  size="sm"
                />
              </td>
              <td class="text-tertiary" style="font-size: var(--font-size-sm);">{{ formatDate(article.createdAt) }}</td>
              <td class="admin-table__actions">
                <BaseButton variant="text" size="sm" :to="`/admin/articles/${article.id}/edit`">编辑</BaseButton>
                <BaseButton variant="text" size="sm" @click="handleDelete(article)">删除</BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <BasePagination
        :current="currentPage"
        :total="totalPages"
        @change="handlePageChange"
      />
    </template>

    <BaseEmpty v-else message="暂无文章" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useArticlesStore } from '@/stores/articles.store'
import { formatDate } from '@/utils/format'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTag from '@/components/common/BaseTag.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseSpinner from '@/components/common/BaseSpinner.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'

const articlesStore = useArticlesStore()

const list = computed(() => articlesStore.list)
const loading = computed(() => articlesStore.loading)
const currentPage = computed(() => articlesStore.currentPage)
const totalPages = computed(() => articlesStore.totalPages)

function handlePageChange(page) {
  articlesStore.currentPage = page
  fetchData()
}

async function fetchData() {
  // Clear any lingering filters from public pages
  articlesStore.clearFilters()
  await articlesStore.fetchList({ pageSize: 20, status: 'all' })
}

async function handleDelete(article) {
  if (!confirm(`确定删除文章「${article.title}」？`)) return
  await articlesStore.deleteArticle(article.id)
}

onMounted(fetchData)
</script>

<style lang="scss" scoped>
.article-manage {
  &__header {
    @include flex-between;
    margin-bottom: var(--space-xl);

    h1 {
      font-size: var(--font-size-2xl);
    }
  }
}

.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);

  th {
    text-align: left;
    padding: var(--space-sm) var(--space-md);
    border-bottom: 2px solid var(--color-border);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  td {
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--color-border-light);
  }

  &__title {
    @include truncate(1);
    max-width: 300px;
    font-weight: var(--font-weight-medium);
  }

  &__actions {
    display: flex;
    gap: var(--space-xs);
    white-space: nowrap;
  }
}
</style>
