// ===== Table of Contents Composable =====
import { ref, onUnmounted } from 'vue'

export function useToc() {
  const headings = ref([])
  const activeId = ref(null)
  let observer = null

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w一-鿿]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function extract(containerEl) {
    if (!containerEl) return
    const hTags = containerEl.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const seen = new Set()
    headings.value = Array.from(hTags).map((h) => {
      let id = h.id || slugify(h.textContent || '')
      // Deduplicate: append -2, -3, etc. for repeated headings
      let deduped = id
      let counter = 2
      while (seen.has(deduped)) {
        deduped = `${id}-${counter++}`
      }
      seen.add(deduped)
      h.id = deduped
      return {
        id: deduped,
        text: h.textContent || '',
        level: parseInt(h.tagName[1]),
      }
    })
  }

  function observe() {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )
    headings.value.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
  }

  function cleanup() {
    observer?.disconnect()
    observer = null
  }

  onUnmounted(cleanup)

  return { headings, activeId, extract, observe, cleanup }
}
