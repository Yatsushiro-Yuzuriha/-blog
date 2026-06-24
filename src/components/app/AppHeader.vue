<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <!-- Logo -->
      <router-link to="/" class="app-header__logo">
        个人博客
      </router-link>

      <!-- Desktop Nav -->
      <nav class="app-header__nav">
        <router-link to="/" class="nav-link" active-class="nav-link--active">
          首页
        </router-link>
        <router-link to="/about" class="nav-link" active-class="nav-link--active">
          关于
        </router-link>
      </nav>

      <!-- Right Actions -->
      <div class="app-header__actions">
        <!-- Search -->
        <router-link to="/search" class="header-btn" title="搜索">
          🔍
        </router-link>

        <!-- Theme Toggle -->
        <button class="header-btn" @click="toggleTheme" :title="isDark ? '亮色模式' : '暗色模式'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>

        <!-- Auth -->
        <template v-if="isAuthenticated">
          <div class="user-menu" ref="menuRef">
            <button class="header-btn user-menu__trigger" @click="menuOpen = !menuOpen">
              {{ authStore.user?.username || '用户' }}
            </button>
            <Transition name="scale">
              <div v-if="menuOpen" class="user-menu__dropdown">
                <router-link to="/profile" class="dropdown-item" @click="menuOpen = false">
                  个人资料
                </router-link>
                <router-link
                  v-if="authStore.isAdmin || authStore.isAuthor"
                  to="/admin"
                  class="dropdown-item"
                  @click="menuOpen = false"
                >
                  管理后台
                </router-link>
                <button class="dropdown-item" @click="handleLogout">退出登录</button>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="header-btn">登录</router-link>
        </template>

        <!-- Mobile Menu Toggle -->
        <button class="header-btn mobile-toggle" @click="toggleMobileMenu">
          ☰
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useThemeStore } from '@/stores/theme.store'
import { useUiStore } from '@/stores/ui.store'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const uiStore = useUiStore()

const menuOpen = ref(false)
const menuRef = ref(null)
const isDark = computed(() => themeStore.isDark)
const isAuthenticated = computed(() => authStore.isAuthenticated)

function toggleTheme() {
  themeStore.toggle()
}

function toggleMobileMenu() {
  uiStore.toggleMobileMenu()
}

function handleLogout() {
  authStore.logout()
  menuOpen.value = false
  router.push('/')
}

// Close dropdown on outside click
function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  authStore.restoreSession()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: var(--z-header);
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.9);

  [data-theme='dark'] & {
    background: rgba(26, 26, 26, 0.9);
  }

  &__inner {
    @include flex-between;
    height: 100%;
  }

  &__logo {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.01em;
  }

  &__nav {
    display: flex;
    gap: var(--space-sm);

    @include mobile {
      display: none;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
}

.nav-link {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-text);
    background: var(--color-bg-secondary);
  }

  &--active {
    color: var(--color-text);
    background: var(--color-bg-secondary);
  }
}

.header-btn {
  @include button-reset;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-text);
    background: var(--color-bg-secondary);
  }
}

.mobile-toggle {
  display: none;

  @include mobile {
    display: block;
  }
}

// User dropdown
.user-menu {
  position: relative;

  &__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: var(--space-sm);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    min-width: 150px;
    padding: var(--space-xs);
    z-index: var(--z-sidebar);
  }
}

.dropdown-item {
  @include button-reset;
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--color-bg-secondary);
  }
}
</style>
