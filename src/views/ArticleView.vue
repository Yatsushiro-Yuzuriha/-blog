<template>
  <div class="article-page">
    <div v-if="articlesStore.loading && !articlesStore.current" class="article-page__loading">
      <BaseSpinner text="加载文章中..." />
    </div>

    <template v-else-if="articlesStore.current">
      <!-- Article Header -->
      <header class="article-page__header">
        <h1 class="article-page__title">{{ articlesStore.current.title }}</h1>
        <ArticleMeta :article="articlesStore.current" />
      </header>

      <div class="article-page__layout">
        <!-- TOC Sidebar (desktop) -->
        <aside class="article-page__toc">
          <ArticleToc :headings="tocHeadings" :active-id="activeTocId" />
        </aside>

        <!-- Article Content -->
        <div class="article-page__content">
          <ArticleDetail
            :content="articlesStore.current.content"
            @rendered="onContentRendered"
          />

          <!-- Article Navigation -->
          <ArticleNav
            :prev="articlesStore.prevArticle"
            :next="articlesStore.nextArticle"
          />

          <!-- Comments -->
          <CommentForm
            :reply-to="replyTo?.id"
            :reply-to-author="replyTo?.author?.username"
            @submit="handleCommentSubmit"
            @cancel="replyTo = null"
          />
          <CommentList
            :comments="commentsStore.comments"
            :loading="commentsStore.loading"
            @reply="handleReply"
          />
        </div>
      </div>
    </template>

    <BaseEmpty v-else message="文章不存在" icon="📄" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '@/stores/articles.store'
import { useCommentsStore } from '@/stores/comments.store'
import { useToc } from '@/composables/useToc'
import ArticleDetail from '@/components/article/ArticleDetail.vue'
import ArticleMeta from '@/components/article/ArticleMeta.vue'
import ArticleToc from '@/components/article/ArticleToc.vue'
import ArticleNav from '@/components/article/ArticleNav.vue'
import CommentList from '@/components/comment/CommentList.vue'
import CommentForm from '@/components/comment/CommentForm.vue'
import BaseSpinner from '@/components/common/BaseSpinner.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'

const route = useRoute()
const articlesStore = useArticlesStore()
const commentsStore = useCommentsStore()
const { headings: tocHeadings, activeId: activeTocId, extract, observe, cleanup } = useToc()

const replyTo = ref(null)

function onContentRendered(containerEl) {
  cleanup()
  extract(containerEl)
  nextTick(() => observe())
}

function handleReply(commentId) {
  const comment = commentsStore.comments.find((c) => c.id === commentId)
  if (comment) {
    replyTo.value = comment
  }
}

async function handleCommentSubmit(data) {
  try {
    await commentsStore.create(route.params.id, data)
    replyTo.value = null
  } catch {
    // Error surfaced via commentsStore or UI toast
  }
}

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      await articlesStore.fetchDetail(id)
      await commentsStore.fetchList(id)
      replyTo.value = null
    }
  }
)

onMounted(async () => {
  if (route.params.id) {
    await articlesStore.fetchDetail(route.params.id)
    await commentsStore.fetchList(route.params.id)
  }
})
</script>

<style lang="scss" scoped>
.article-page {
  &__loading {
    padding: var(--space-4xl) 0;
  }

  &__header {
    margin-bottom: var(--space-2xl);
  }

  &__title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: var(--space-lg);
  }

  &__layout {
    display: flex;
    gap: var(--space-2xl);
    align-items: flex-start;
  }

  &__toc {
    width: 200px;
    flex-shrink: 0;
    position: sticky;
    top: calc(var(--header-height) + var(--space-lg));
    max-height: calc(100vh - var(--header-height) - var(--space-2xl));
    overflow-y: auto;
  }

  &__content {
    flex: 1;
    min-width: 0;
    max-width: var(--max-width-content);
  }
}

@include tablet {
  .article-page__toc {
    display: none;
  }

  .article-page__title {
    font-size: var(--font-size-3xl);
  }
}

@include mobile {
  .article-page__title {
    font-size: var(--font-size-2xl);
  }
}
</style>
