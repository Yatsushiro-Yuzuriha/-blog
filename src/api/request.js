// ===== Axios Instance + Interceptors =====
import axios from 'axios'
import { getItem, setItem, removeItem, clearAll } from '@/utils/storage'
import { handleMockRequest } from '@/mock/handler'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ===== Client-side Mock Adapter (production only) =====
// In the production build on GitHub Pages, there is no backend server.
// We replace axios's default adapter so ALL HTTP requests return mock data
// without ever leaving the browser.
// In development, the Vite mock plugin handles API interception at the server
// level, so we leave the adapter untouched.
if (import.meta.env.VITE_USE_MOCK === 'true' && import.meta.env.PROD) {
  instance.defaults.adapter = function mockAdapter(config) {
    const fullUrl = (instance.defaults.baseURL || '') + (config.url || '')
    const [status, data] = handleMockRequest({ ...config, url: fullUrl })

    return new Promise((resolve) => {
      resolve({ data, status, statusText: status < 400 ? 'OK' : 'Error', headers: {}, config })
    })
  }
}

// ===== Request Interceptor =====
instance.interceptors.request.use((config) => {
  const token = getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== Response Interceptor =====
instance.interceptors.response.use(
  // Success: unwrap response data
  (response) => {
    const body = response.data
    if (body && body.code !== undefined && body.code !== 0) {
      return Promise.reject(new Error(body.message || 'Request failed'))
    }
    // Return data directly (or full body for mock compatibility)
    return body.data !== undefined ? body.data : body
  },
  // Error: handle by status
  async (error) => {
    if (!error.response) {
      console.error('Network error:', error.message)
      return Promise.reject(error)
    }

    const { status, config } = error.response

    switch (status) {
      case 401: {
        // Attempt token refresh
        const refreshToken = getItem('refresh_token')
        if (refreshToken && config && !config._retry) {
          config._retry = true
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/refresh`,
              { refreshToken }
            )
            const newToken = res.data.data?.accessToken || res.data.accessToken
            setItem('access_token', newToken)
            // Also update the Pinia auth store if available
            try {
              const { useAuthStore } = await import('@/stores/auth.store')
              const authStore = useAuthStore()
              if (authStore.token != null) {
                authStore.token = newToken
              }
            } catch {}
            config.headers.Authorization = `Bearer ${newToken}`
            return instance(config)
          } catch {
            // Refresh failed, clear session
            clearAll()
            window.location.href = '/login'
          }
        } else {
          clearAll()
          window.location.href = '/login'
        }
        break
      }
      case 403:
        console.error('Forbidden')
        break
      case 404:
        console.error('Not found:', config?.url)
        break
      case 500:
        console.error('Server error')
        break
    }

    return Promise.reject(error)
  }
)

export default instance
