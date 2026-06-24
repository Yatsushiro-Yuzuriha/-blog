<template>
  <div class="profile-view content-container">
    <h1>个人资料</h1>

    <div v-if="authStore.user" class="profile-card">
      <div class="profile-card__avatar">
        {{ authStore.user.username?.charAt(0)?.toUpperCase() }}
      </div>
      <div class="profile-card__info">
        <h2>{{ authStore.user.username }}</h2>
        <p class="text-secondary">{{ authStore.user.email }}</p>
        <p class="text-secondary">
          角色：<strong>{{ roleLabel }}</strong>
        </p>
        <p v-if="authStore.user.bio" class="text-secondary mt-sm">{{ authStore.user.bio }}</p>
        <p class="text-tertiary mt-sm" style="font-size: var(--font-size-sm);">
          注册时间：{{ authStore.user.createdAt }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { ROLE_LABELS } from '@/utils/constants'

const authStore = useAuthStore()

const roleLabel = computed(() => ROLE_LABELS[authStore.user?.role] || authStore.user?.role || '')
</script>

<style lang="scss" scoped>
.profile-view {
  padding: var(--space-3xl) 0;

  h1 {
    margin-bottom: var(--space-2xl);
  }
}

.profile-card {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-2xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);

  &__avatar {
    @include flex-center;
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    background: var(--color-text);
    color: var(--color-bg);
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
  }
}

@include mobile {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
