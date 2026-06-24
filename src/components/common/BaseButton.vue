<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="disabled || loading"
    class="base-btn"
    :class="[`base-btn--${variant}`, `base-btn--${size}`, { 'base-btn--loading': loading, 'base-btn--block': block }]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="base-btn__spinner"></span>
    <span class="base-btn__content"><slot /></span>
  </component>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | ghost | text | danger
  size: { type: String, default: 'md' },         // sm | md | lg
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  to: { type: [String, Object], default: '' },
  type: { type: String, default: 'button' },
})
</script>

<style lang="scss" scoped>
.base-btn {
  @include button-reset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid var(--color-text);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Sizes
  &--sm {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-sm);
    height: 32px;
  }

  &--md {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-base);
    height: 40px;
  }

  &--lg {
    padding: var(--space-md) var(--space-lg);
    font-size: var(--font-size-lg);
    height: 48px;
  }

  // Variants
  &--primary {
    background: var(--color-text);
    color: var(--color-bg);
    &:hover:not(:disabled) { background: var(--color-text-secondary); }
  }

  &--ghost {
    background: transparent;
    color: var(--color-text);
    border: 1px solid var(--color-border);
    &:hover:not(:disabled) { background: var(--color-bg-secondary); border-color: var(--color-text); }
  }

  &--text {
    background: transparent;
    color: var(--color-text-secondary);
    &:hover:not(:disabled) { color: var(--color-text); background: var(--color-bg-secondary); }
  }

  &--danger {
    background: var(--color-danger);
    color: #fff;
    &:hover:not(:disabled) { opacity: 0.9; }
  }

  &--block {
    width: 100%;
  }

  &--loading {
    cursor: wait;
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
