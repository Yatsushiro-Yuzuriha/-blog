<template>
  <div class="article-list">
    <BaseSpinner v-if="loading" text="加载文章中..." />

    <template v-else-if="articles.length > 0">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
      <BasePagination
        :current="currentPage"
        :total="totalPages"
        @change="$emit('page-change', $event)"
      />
    </template>

    <BaseEmpty v-else message="暂无文章" icon="📝" />
  </div>
</template>

<script setup>
import ArticleCard from './ArticleCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseSpinner from '@/components/common/BaseSpinner.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'

defineProps({
  articles: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 0 },
})

defineEmits(['page-change'])
</script>
