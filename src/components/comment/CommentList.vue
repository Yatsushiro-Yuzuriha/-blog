<template>
  <section class="comments">
    <h3 class="comments__title">评论 ({{ comments.length }})</h3>

    <div v-if="loading" class="comments__loading">
      <BaseSpinner size="sm" />
    </div>

    <template v-else-if="comments.length > 0">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @reply="$emit('reply', comment.id)"
      />
    </template>

    <BaseEmpty v-else message="暂无评论，来发表第一条评论吧" icon="💬" />
  </section>
</template>

<script setup>
import CommentItem from './CommentItem.vue'
import BaseSpinner from '@/components/common/BaseSpinner.vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'

defineProps({
  comments: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

defineEmits(['reply'])
</script>

<style lang="scss" scoped>
.comments {
  margin-top: var(--space-3xl);
  padding-top: var(--space-2xl);
  border-top: 1px solid var(--color-border);

  &__title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-lg);
  }

  &__loading {
    padding: var(--space-xl) 0;
  }
}
</style>
