// ===== Scroll Helper Composable =====

export function useScrollTo() {
  function toTop(behavior = 'smooth') {
    window.scrollTo({ top: 0, behavior })
  }

  function toElement(selector, offset = 0, behavior = 'smooth') {
    const el = document.querySelector(selector)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior })
    }
  }

  return { toTop, toElement }
}
