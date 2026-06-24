<template>
  <nav v-if="total > 1" class="pagination" aria-label="分页导航">
    <button class="pagination__btn" :disabled="current <= 1" @click="$emit('change', current - 1)">← 上一页</button>

    <div class="pagination__pages">
      <button
        v-for="page in visiblePages"
        :key="page"
        class="pagination__page"
        :class="{ 'pagination__page--active': page === current, 'pagination__page--dots': page === '...' }"
        :disabled="page === '...'"
        @click="page !== '...' && $emit('change', page)"
      >
        {{ page }}
      </button>
    </div>

    <button class="pagination__btn" :disabled="current >= total" @click="$emit('change', current + 1)">下一页 →</button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  maxVisible: { type: Number, default: 7 },
})

defineEmits(['change'])

const visiblePages = computed(() => {
  const pages = []
  const total = props.total
  const current = props.current
  const max = props.maxVisible

  if (total <= max) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  // Always show first page
  pages.push(1)

  const sideCount = Math.floor((max - 3) / 2)
  let start = Math.max(2, current - sideCount)
  let end = Math.min(total - 1, current + sideCount)

  if (current - sideCount <= 2) {
    end = Math.min(total - 1, max - 2)
  }
  if (current + sideCount >= total - 1) {
    start = Math.max(2, total - max + 1)
  }

  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')

  pages.push(total)
  return pages
})
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-xl) 0;

  &__btn {
    @include button-reset;
    padding: var(--space-xs) var(--space-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);

    &:hover:not(:disabled) { color: var(--color-text); background: var(--color-bg-secondary); }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
  }

  &__pages {
    display: flex;
    gap: 2px;
  }

  &__page {
    @include button-reset;
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);

    &:hover:not(:disabled):not(&--active) {
      background: var(--color-bg-secondary);
      color: var(--color-text);
    }

    &--active {
      background: var(--color-text);
      color: var(--color-bg);
      font-weight: var(--font-weight-semibold);
    }

    &--dots {
      cursor: default;
      &:hover { background: transparent; color: var(--color-text-secondary); }
    }
  }
}

@include mobile {
  .pagination__btn {
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
  }
  .pagination__page {
    min-width: 32px;
    height: 32px;
    font-size: var(--font-size-xs);
  }
}
</style>
