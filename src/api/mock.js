// ===== Mock Gate =====
// vite-plugin-mock handles interception at the dev-server level.
// This file exists as documentation; no manual setup needed.
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
  console.log('[App] Mock API mode enabled')
}
