<template>
  <div class="page-layout auth-layout">
    <main class="auth-layout__main">
      <div class="auth-card">
        <router-link to="/" class="auth-card__logo">
          博客
        </router-link>
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.auth-layout {
  &__main {
    @include flex-center;
    min-height: 100vh;
    padding: var(--space-lg);
  }
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);

  &__logo {
    display: block;
    text-align: center;
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.01em;
    margin-bottom: var(--space-xl);
  }
}

@include mobile {
  .auth-card {
    border: none;
    padding: var(--space-lg);
  }
}
</style>
