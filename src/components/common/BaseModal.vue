<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeOnOverlay && $emit('update:modelValue', false)">
        <Transition name="scale">
          <div v-if="modelValue" class="modal" :class="`modal--${size}`" role="dialog" aria-modal="true">
            <div v-if="title || $slots.header" class="modal__header">
              <h2 class="modal__title">{{ title }}</h2>
              <slot name="header" />
              <button v-if="closable" class="modal__close" @click="$emit('update:modelValue', false)">&times;</button>
            </div>
            <div class="modal__body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closable: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  size: { type: String, default: 'md' }, // sm | md | lg
})

const emit = defineEmits(['update:modelValue'])

// Lock body scroll when modal is open
watch(
  () => props.modelValue,
  (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
  }
)

// Close on Escape
function onKeydown(e) {
  if (e.key === 'Escape' && props.modelValue && props.closable) {
    emit('update:modelValue', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  // Restore body scroll in case modal was open when component unmounted
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  @include flex-center;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.modal {
  width: 100%;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  &--sm { max-width: 400px; }
  &--md { max-width: 560px; }
  &--lg { max-width: 720px; }

  &__header {
    @include flex-between;
    padding: var(--space-lg) var(--space-xl);
    border-bottom: 1px solid var(--color-border-light);
  }

  &__title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
  }

  &__close {
    @include button-reset;
    font-size: var(--font-size-2xl);
    color: var(--color-text-secondary);
    line-height: 1;
    &:hover { color: var(--color-text); }
  }

  &__body {
    padding: var(--space-xl);
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    padding: var(--space-md) var(--space-xl);
    border-top: 1px solid var(--color-border-light);
    display: flex;
    justify-content: flex-end;
    gap: var(--space-sm);
  }
}
</style>
