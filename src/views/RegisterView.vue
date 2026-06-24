<template>
  <div class="register-view">
    <h1 class="text-center mb-xl">注册</h1>

    <form class="auth-form" @submit.prevent="handleRegister">
      <BaseInput
        v-model="form.username"
        label="用户名"
        placeholder="请输入用户名"
        :error="errors.username"
      />

      <BaseInput
        v-model="form.email"
        label="邮箱"
        type="email"
        placeholder="请输入邮箱"
        :error="errors.email"
      />

      <BaseInput
        v-model="form.password"
        label="密码"
        type="password"
        placeholder="至少 6 位密码"
        :error="errors.password"
      />

      <BaseInput
        v-model="form.confirmPassword"
        label="确认密码"
        type="password"
        placeholder="再次输入密码"
        :error="errors.confirmPassword"
      />

      <p v-if="serverError" class="auth-form__error">{{ serverError }}</p>

      <BaseButton type="submit" block :loading="loading">注册</BaseButton>
    </form>

    <p class="auth-form__footer">
      已有账号？<router-link to="/login">立即登录</router-link>
    </p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateConfirmPassword,
} from '@/utils/validation'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ username: '', email: '', password: '', confirmPassword: '' })
const errors = reactive({ username: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const serverError = ref('')

function validate() {
  errors.username = validateUsername(form.username)
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)
  errors.confirmPassword = validateConfirmPassword(form.password, form.confirmPassword)
  return !errors.username && !errors.email && !errors.password && !errors.confirmPassword
}

async function handleRegister() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password,
    })
    router.push('/')
  } catch (e) {
    serverError.value = e.message || '注册失败，请重试'
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
