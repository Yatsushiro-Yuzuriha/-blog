<template>
  <aside class="app-sidebar">
    <!-- Categories -->
    <section class="sidebar-section">
      <h3 class="sidebar-section__title">分类</h3>
      <div class="sidebar-tags">
        <BaseTag
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.name"
          :to="`/?category=${cat.slug}`"
          size="sm"
        />
      </div>
    </section>

    <!-- Tags -->
    <section class="sidebar-section">
      <h3 class="sidebar-section__title">标签</h3>
      <div class="sidebar-tags">
        <BaseTag
          v-for="tag in tags"
          :key="tag.id"
          :label="tag.name"
          :to="`/?tag=${tag.slug}`"
          variant="ghost"
          size="sm"
        />
      </div>
    </section>
  </aside>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories.store'
import { useTagsStore } from '@/stores/tags.store'
import BaseTag from '@/components/common/BaseTag.vue'

const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()

const categories = categoriesStore.list
const tags = tagsStore.list

onMounted(() => {
  categoriesStore.fetchList()
  tagsStore.fetchList()
})
</script>

<style lang="scss" scoped>
.app-sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
}

.sidebar-section {
  margin-bottom: var(--space-xl);

  &__title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-md);
  }
}

.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}
</style>
