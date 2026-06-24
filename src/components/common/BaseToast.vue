<template>
  <Teleport to="body">
    <TransitionGroup name="slide-up" tag="div" class="toast-container">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        <span class="toast__message">{{ toast.message }}</span>
        <button class="toast__close" @click="uiStore.removeToast(toast.id)">&times;</button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.store'
const uiStore = useUiStore()
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: calc(var(--header-height) + var(--space-md));
  right: var(--space-md);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background: var(--color-text);
  color: var(--color-bg);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-md);
  pointer-events: auto;
  min-width: 200px;
  max-width: 360px;

  &--success {
    background: var(--color-success);
    color: #fff;
  }

  &--error {
    background: var(--color-danger);
    color: #fff;
  }

  &--info {
    background: var(--color-text);
    color: var(--color-bg);
  }

  &__message {
    flex: 1;
  }

  &__close {
    @include button-reset;
    font-size: var(--font-size-lg);
    opacity: 0.6;
    line-height: 1;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
