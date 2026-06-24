<template>
  <nav class="article-nav" v-if="prev || next">
    <div class="article-nav__item">
      <router-link v-if="prev" :to="`/article/${prev.id}`" class="article-nav__link article-nav__link--prev">
        <span class="article-nav__label">← 上一篇</span>
        <span class="article-nav__title">{{ prev.title }}</span>
      </router-link>
    </div>
    <div class="article-nav__item article-nav__item--next">
      <router-link v-if="next" :to="`/article/${next.id}`" class="article-nav__link article-nav__link--next">
        <span class="article-nav__label">下一篇 →</span>
        <span class="article-nav__title">{{ next.title }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  prev: { type: Object, default: null },
  next: { type: Object, default: null },
})
</script>

<style lang="scss" scoped>
.article-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-top: var(--space-3xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);

  &__item--next {
    text-align: right;
  }

  &__link {
    display: block;
    padding: var(--space-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-light);
    transition: all var(--transition-fast);
    text-decoration: none;

    &:hover {
      border-color: var(--color-border);
      background: var(--color-bg-secondary);
    }
  }

  &__label {
    display: block;
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-xs);
  }

  &__title {
    font-size: var(--font-size-base);
    color: var(--color-text);
    @include truncate(1);
  }
}

@include mobile {
  .article-nav {
    grid-template-columns: 1fr;
  }
}
</style>
