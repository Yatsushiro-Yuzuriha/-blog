<template>
  <footer class="app-footer">
    <div class="container app-footer__inner">
      <div class="app-footer__brand">
        <span class="app-footer__logo">个人博客</span>
        <p class="app-footer__desc">分享技术、设计与生活</p>
      </div>
      <div class="app-footer__links">
        <router-link to="/" class="footer-link">首页</router-link>
        <router-link to="/about" class="footer-link">关于</router-link>
        <router-link to="/search" class="footer-link">搜索</router-link>
      </div>
      <div class="app-footer__copy">
        &copy; {{ year }} 个人博客. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-2xl) 0;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    text-align: center;
  }

  &__logo {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-lg);
  }

  &__desc {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-top: var(--space-xs);
  }

  &__links {
    display: flex;
    gap: var(--space-lg);
  }

  &__copy {
    color: var(--color-text-tertiary);
    font-size: var(--font-size-xs);
  }
}

.footer-link {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-text);
  }
}
</style>
