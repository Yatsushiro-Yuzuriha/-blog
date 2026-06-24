<template>
  <div class="empty">
    <span class="empty__icon">{{ icon }}</span>
    <p class="empty__message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: '暂无内容' },
  icon: { type: String, default: '📭' },
})
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl) var(--space-md);

  &__icon {
    font-size: 3rem;
    margin-bottom: var(--space-md);
    opacity: 0.6;
  }

  &__message {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
  }
}
</style>
