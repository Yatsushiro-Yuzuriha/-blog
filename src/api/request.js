// ===== Axios Instance + Interceptors =====
import axios from 'axios'
import { getItem, setItem, removeItem, clearAll } from '@/utils/storage'
import { handleMockRequest } from '@/mock/handler'

const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

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

// ===== Client-side Mock =====
// When VITE_USE_MOCK=true, wraps axios methods to return mock data directly
// without making actual HTTP requests. Works in both dev and production.
if (MOCK_MODE) {
  const _instance = instance
  const methods = ['get', 'post', 'put', 'delete', 'patch']
  methods.forEach((method) => {
    const _orig = _instance[method]
    _instance[method] = function (url, dataOrConfig, maybeConfig) {
      const isBodyMethod = ['post', 'put', 'patch'].includes(method)
      const config = isBodyMethod ? (maybeConfig || {}) : (dataOrConfig || {})
      const body = isBodyMethod ? dataOrConfig : undefined
      const fullUrl = (_instance.defaults.baseURL || '') + url

      const mockConfig = {
        url: fullUrl,
        method: method.toUpperCase(),
        params: config?.params,
        data: body,
        headers: config?.headers,
      }
      const [status, data] = handleMockRequest(mockConfig)

      if (status >= 200 && status < 300) {
        return Promise.resolve({ data, status, statusText: 'OK', headers: {}, config })
      }
      return Promise.reject({
        response: { data, status, statusText: 'Error', headers: {}, config },
        message: data?.message || 'Request failed',
      })
    }
  })
}
