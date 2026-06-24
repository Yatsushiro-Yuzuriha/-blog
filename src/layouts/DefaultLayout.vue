<template>
  <div class="page-layout">
    <AppHeader />
    <main class="page-layout__main">
      <div class="container">
        <slot />
      </div>
    </main>
    <AppFooter />
    <BackToTop />
    <BaseToast />
  </div>
</template>

<script setup>
import AppHeader from '@/components/app/AppHeader.vue'
import AppFooter from '@/components/app/AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import BaseToast from '@/components/common/BaseToast.vue'
</script>
