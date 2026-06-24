<template>
  <Transition name="fade">
    <button
      v-show="visible"
      class="back-to-top"
      @click="scrollToTop"
      title="回到顶部"
    >
      ↑
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.back-to-top {
  @include button-reset;
  @include flex-center;
  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--color-text);
  color: var(--color-bg);
  font-size: var(--font-size-xl);
  box-shadow: var(--shadow-md);
  z-index: 50;
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}
</style>
