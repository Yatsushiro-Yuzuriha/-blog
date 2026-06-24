<template>
  <component
    :is="to ? 'router-link' : 'span'"
    :to="to"
    class="base-tag"
    :class="[`base-tag--${variant}`, `base-tag--${size}`, { 'base-tag--clickable': clickable }]"
    @click="clickable && !to && $emit('click')"
  >
    <slot>{{ label }}</slot>
  </component>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  variant: { type: String, default: 'default' }, // default | ghost | active
  size: { type: String, default: 'md' },         // sm | md
  to: { type: [String, Object], default: '' },
  clickable: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.base-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all var(--transition-fast);

  &--sm {
    padding: 1px 8px;
    font-size: 0.7rem;
  }

  &--default {
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
  }

  &--ghost {
    background: transparent;
    color: var(--color-text-tertiary);
    border: 1px solid var(--color-border-light);
  }

  &--active {
    background: var(--color-text);
    color: var(--color-bg);
  }

  &--clickable {
    cursor: pointer;
    &:hover { opacity: 0.8; }
  }
}

a.base-tag:hover {
  opacity: 0.8;
}
</style>
