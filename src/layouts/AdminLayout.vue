<template>
  <div class="page-layout admin-layout">
    <AppHeader />
    <div class="admin-layout__body container">
      <aside class="admin-layout__sidebar">
        <nav class="admin-nav">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="admin-nav__item"
            :class="{ 'admin-nav__item--active': isActive(item.to) }"
          >
            <span class="admin-nav__icon" v-html="item.icon"></span>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </aside>
      <main class="admin-layout__main">
        <slot />
      </main>
    </div>
    <BaseToast />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppHeader from '@/components/app/AppHeader.vue'
import BaseToast from '@/components/common/BaseToast.vue'

const route = useRoute()
const authStore = useAuthStore()

const navItems = computed(() => {
  const items = [
    { to: '/admin', label: '仪表盘', icon: '📊', roles: ['admin', 'author'] },
    { to: '/admin/articles', label: '文章管理', icon: '📄', roles: ['admin', 'author'] },
    { to: '/admin/comments', label: '评论管理', icon: '💬', roles: ['admin'] },
    { to: '/admin/users', label: '用户管理', icon: '👥', roles: ['admin'] },
  ]
  // Filter by role: only show items the user can access
  const role = authStore.userRole || 'reader'
  return items.filter((item) => item.roles.includes(role))
})

function isActive(path) {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}
</script>

<style lang="scss" scoped>
.admin-layout {
  &__body {
    display: flex;
    gap: var(--space-xl);
    padding-top: calc(var(--header-height) + var(--space-xl));
    padding-bottom: var(--space-3xl);
  }

  &__sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }
}

.admin-nav {
  position: sticky;
  top: calc(var(--header-height) + var(--space-lg));

  &__item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
    margin-bottom: var(--space-xs);

    &:hover {
      background: var(--color-bg-secondary);
      color: var(--color-text);
    }

    &--active {
      background: var(--color-text);
      color: var(--color-bg);
    }
  }

  &__icon {
    font-size: var(--font-size-lg);
  }
}

@include tablet {
  .admin-layout__sidebar {
    display: none;
  }
}
</style>
