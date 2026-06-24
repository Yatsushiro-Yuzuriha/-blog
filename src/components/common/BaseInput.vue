<template>
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label v-if="label" :for="inputId" class="base-input__label">{{ label }}</label>
    <div class="base-input__wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="base-input__field"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        v-bind="$attrs"
      />
    </div>
    <p v-if="error" class="base-input__error">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'blur'])

let idCounter = 0
const inputId = `input-${++idCounter}`
</script>

<style lang="scss" scoped>
.base-input {
  &__label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    margin-bottom: var(--space-xs);
  }

  &__wrapper {
    position: relative;
  }

  &__field {
    width: 100%;
    height: 40px;
    padding: 0 var(--space-md);
    font-size: var(--font-size-base);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    transition: border-color var(--transition-fast);

    &::placeholder {
      color: var(--color-text-tertiary);
    }

    &:focus {
      outline: none;
      border-color: var(--color-text);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--color-bg-secondary);
    }
  }

  &--error {
    .base-input__field {
      border-color: var(--color-danger);
    }
  }

  &__error {
    margin-top: var(--space-xs);
    font-size: var(--font-size-xs);
    color: var(--color-danger);
  }
}
</style>
