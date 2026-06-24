<template>
  <div class="comment-form">
    <template v-if="isAuthenticated">
      <textarea
        v-model="content"
        class="comment-form__textarea"
        :placeholder="replyTo ? `回复 @${replyToAuthor}...` : '写下你的评论...'"
        rows="3"
        maxlength="2000"
      ></textarea>
      <div class="comment-form__footer">
        <span class="comment-form__count">{{ content.length }}/2000</span>
        <div class="comment-form__actions">
          <BaseButton v-if="replyTo" variant="text" size="sm" @click="$emit('cancel')">取消</BaseButton>
          <BaseButton size="sm" :disabled="!content.trim()" :loading="submitting" @click="submit">
            发表评论
          </BaseButton>
        </div>
      </div>
      <p v-if="error" class="comment-form__error">{{ error }}</p>
    </template>
    <div v-else class="comment-form__login-prompt">
      <router-link to="/login">登录</router-link> 后发表评论
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  replyTo: { type: String, default: '' },
  replyToAuthor: { type: String, default: '' },
})

const emit = defineEmits(['submit', 'cancel'])

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const content = ref('')
const submitting = ref(false)
const error = ref('')

async function submit() {
  if (!content.value.trim()) return
  const payload = { content: content.value.trim(), parentId: props.replyTo || null }

  submitting.value = true
  error.value = ''
  content.value = ''

  try {
    // emit returns void (sync), but the parent's handler is async.
    // We track submitting state optimistically; on failure the parent
    // should surface the error via UI store / toast.
    emit('submit', payload)
  } catch (e) {
    error.value = e.message || '评论失败'
    content.value = payload.content // restore on error
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.comment-form {
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);

  &__textarea {
    width: 100%;
    min-height: 80px;
    padding: var(--space-md);
    font-size: var(--font-size-base);
    font-family: var(--font-sans);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    resize: vertical;
    transition: border-color var(--transition-fast);

    &::placeholder {
      color: var(--color-text-tertiary);
    }

    &:focus {
      outline: none;
      border-color: var(--color-text);
    }
  }

  &__footer {
    @include flex-between;
    margin-top: var(--space-sm);
  }

  &__count {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
  }

  &__actions {
    display: flex;
    gap: var(--space-sm);
  }

  &__error {
    margin-top: var(--space-sm);
    font-size: var(--font-size-sm);
    color: var(--color-danger);
  }

  &__login-prompt {
    text-align: center;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);

    a {
      color: var(--color-text);
      text-decoration: underline;
      font-weight: var(--font-weight-medium);
    }
  }
}
</style>
