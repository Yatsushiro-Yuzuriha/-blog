<template>
  <div class="login-view">
    <h1 class="text-center mb-xl">登录</h1>

    <form class="auth-form" @submit.prevent="handleLogin" autocomplete="off">
      <BaseInput
        v-model="form.email"
        label="邮箱"
        type="email"
        placeholder="请输入邮箱"
        :error="errors.email"
        autocomplete="off"
      />

      <BaseInput
        v-model="form.password"
        label="密码"
        type="password"
        placeholder="请输入密码"
        :error="errors.password"
        autocomplete="new-password"
      />

      <p v-if="serverError" class="auth-form__error">{{ serverError }}</p>

      <BaseButton type="submit" block :loading="loading">登录</BaseButton>
    </form>

    <p class="auth-form__footer">
      还没有账号？<router-link to="/register">立即注册</router-link>
    </p>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { validateEmail, validatePassword } from '@/utils/validation'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const loading = ref(false)
const serverError = ref('')

// Clear browser-autofilled credentials on mount
onMounted(() => {
  // Delay to run after browser autofill
  setTimeout(() => {
    form.email = ''
    form.password = ''
  }, 150)
})

function validate() {
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)
  return !errors.email && !errors.password
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await authStore.login({ email: form.email, password: form.password })
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    serverError.value = e.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);

  &__error {
    font-size: var(--font-size-sm);
    color: var(--color-danger);
    text-align: center;
  }

  &__footer {
    text-align: center;
    margin-top: var(--space-xl);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);

    a {
      color: var(--color-text);
      font-weight: var(--font-weight-medium);
      text-decoration: underline;
    }
  }
}
</style>
