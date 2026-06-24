<template>
  <div class="comment-item" :class="{ 'comment-item--nested': depth > 0 }">
    <div class="comment-item__avatar">{{ comment.author?.username?.charAt(0) || '?' }}</div>
    <div class="comment-item__body">
      <div class="comment-item__header">
        <span class="comment-item__author">{{ comment.author?.username || '匿名' }}</span>
        <span class="comment-item__time">{{ formatRelativeTime(comment.createdAt) }}</span>
      </div>
      <p class="comment-item__content">{{ comment.content }}</p>
      <div class="comment-item__actions">
        <button
          v-if="isAuthenticated && depth < 3"
          class="comment-item__reply-btn"
          @click="$emit('reply', comment.id)"
        >
          回复
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRelativeTime } from '@/utils/format'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

defineProps({
  comment: { type: Object, required: true },
  depth: { type: Number, default: 0 },
})

defineEmits(['reply'])
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md) 0;

  &--nested {
    margin-left: var(--space-2xl);
    padding-left: var(--space-md);
    border-left: 1px solid var(--color-border-light);
  }

  &__avatar {
    @include flex-center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--color-bg-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-xs);
  }

  &__author {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
  }

  &__time {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
  }

  &__content {
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    color: var(--color-text);
    word-break: break-word;
  }

  &__actions {
    margin-top: var(--space-xs);
  }

  &__reply-btn {
    @include button-reset;
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    &:hover { color: var(--color-text); }
  }
}
</style>
