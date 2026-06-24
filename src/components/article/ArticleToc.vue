<template>
  <nav v-if="headings.length > 0" class="toc">
    <h4 class="toc__title">目录</h4>
    <ul class="toc__list">
      <li
        v-for="heading in headings"
        :key="heading.id"
        class="toc__item"
        :class="[`toc__item--level-${heading.level}`, { 'toc__item--active': activeId === heading.id }]"
      >
        <a :href="`#${heading.id}`" class="toc__link" @click.prevent="handleClick(heading.id)">
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  headings: { type: Array, default: () => [] },
  activeId: { type: String, default: null },
})

function handleClick(id) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
.toc {
  &__title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-md);
  }

  &__list {
    border-left: 1px solid var(--color-border);
  }

  &__item {
    &--level-1 { padding-left: 0; }
    &--level-2 { padding-left: var(--space-md); }
    &--level-3 { padding-left: var(--space-xl); }
    &--level-4,
    &--level-5,
    &--level-6 { padding-left: var(--space-2xl); }

    &--active .toc__link {
      color: var(--color-text);
      font-weight: var(--font-weight-medium);
    }
  }

  &__link {
    display: block;
    padding: 3px 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);

    &:hover {
      color: var(--color-text);
    }
  }
}
</style>
