import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

// ===== Custom Mock Plugin =====
function mockPlugin(isEnabled) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const MOCK_DIR = path.resolve(__dirname, 'mock')

  return {
    name: 'vite-plugin-mock',
    configureServer(server) {
      if (!isEnabled) {
        console.log('[mock] Mock API disabled')
        return
      }

      // Load all mock modules
      const require_ = createRequire(import.meta.url)
      const handlers = []
      const files = fs.readdirSync(MOCK_DIR).filter((f) => f.endsWith('.cjs') && f !== 'index.cjs' && f !== '_utils.cjs')

      for (const file of files) {
        try {
          const mod = require_(path.join(MOCK_DIR, file))
          // module.exports is directly an array of handlers
          if (Array.isArray(mod)) {
            handlers.push(...mod)
          } else if (mod.default && Array.isArray(mod.default)) {
            handlers.push(...mod.default)
          }
        } catch (e) {
          console.warn(`[mock] Failed to load ${file}:`, e.message)
        }
      }

      console.log(`[mock] Loaded ${handlers.length} mock handlers from ${files.length} files`)

      // Middleware — MUST run before Vite's HTML fallback
      const mockMiddleware = async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next()
        }

        const url = new URL(req.url, `http://${req.headers.host}`)
        const method = req.method.toUpperCase()
        const pathname = url.pathname

        // Parse body for POST/PUT
        let body = null
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          body = await parseBody(req)
        }

        // Find matching handler
        for (const handler of handlers) {
          const match = matchRoute(handler, method, pathname)
          if (match) {
            try {
              const result = handler.response({
                method,
                path: pathname,
                params: match.params,
                query: Object.fromEntries(url.searchParams),
                body,
                headers: req.headers,
              })

              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (e) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ code: -1, message: e.message, data: null }))
            }
            return
          }
        }

        // No handler found — let Vite handle as 404
        next()
      }

      // Insert at the FRONT so mock runs before Vite's HTML fallback
      if (server.middlewares.stack && server.middlewares.stack.length > 0) {
        // Find the HTML fallback and insert right before it
        const htmlFallbackIdx = server.middlewares.stack.findIndex(
          (m) => m.handle && m.handle.name === 'viteHtmlFallbackMiddleware'
        )
        if (htmlFallbackIdx >= 0) {
          server.middlewares.stack.splice(htmlFallbackIdx, 0, { route: '', handle: mockMiddleware })
          console.log('[mock] Mock middleware inserted before HTML fallback')
        } else {
          // Insert at position 0 as fallback
          server.middlewares.stack.unshift({ route: '', handle: mockMiddleware })
          console.log('[mock] Mock middleware inserted at position 0')
        }
      } else {
        server.middlewares.use(mockMiddleware)
        console.log('[mock] Mock middleware added via .use()')
      }
    },
  }
}

function parseBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(null)
      }
    })
  })
}

function matchRoute(handler, method, pathname) {
  if (handler.method !== method) return null

  const parts = handler.url.split('/')
  const actual = pathname.split('/')

  if (parts.length !== actual.length) return null

  const params = {}
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith(':')) {
      params[parts[i].slice(1)] = actual[i]
    } else if (parts[i] !== actual[i]) {
      return null
    }
  }

  return { params }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useMock = env.VITE_USE_MOCK === 'true'

  return {
    base: './',
    plugins: [vue(), mockPlugin(useMock)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/scss/mixins.scss";\n`,
        },
      },
    },
  }
})
