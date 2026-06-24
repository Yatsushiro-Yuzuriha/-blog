<template>
  <div class="spinner" :class="`spinner--${size}`">
    <div class="spinner__icon"></div>
    <p v-if="text" class="spinner__text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' }, // sm | md | lg
  text: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl) 0;

  &__icon {
    border: 3px solid var(--color-border);
    border-top-color: var(--color-text);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;

    .spinner--sm & {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    .spinner--md & {
      width: 36px;
      height: 36px;
    }

    .spinner--lg & {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }
  }

  &__text {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
