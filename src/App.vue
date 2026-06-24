<template>
  <component :is="layout">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ArticleLayout from '@/layouts/ArticleLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()

const layoutMap = {
  default: DefaultLayout,
  article: ArticleLayout,
  admin: AdminLayout,
  auth: AuthLayout,
}

const layout = computed(() => layoutMap[route.meta.layout] || DefaultLayout)
</script>
