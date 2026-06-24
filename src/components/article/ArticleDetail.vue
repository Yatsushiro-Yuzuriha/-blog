<template>
  <div class="article-detail">
    <div ref="contentRef" class="article-content" v-html="renderedHtml"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

const props = defineProps({
  content: { type: String, default: '' },
})

const emit = defineEmits(['rendered'])
const contentRef = ref(null)

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

const renderedHtml = computed(() => {
  if (!props.content) return ''
  const raw = md.render(props.content)
  return DOMPurify.sanitize(raw)
})

watch(renderedHtml, async () => {
  await nextTick()
  if (contentRef.value) {
    emit('rendered', contentRef.value)
  }
})

onMounted(async () => {
  await nextTick()
  if (contentRef.value && props.content) {
    emit('rendered', contentRef.value)
  }
})
</script>
