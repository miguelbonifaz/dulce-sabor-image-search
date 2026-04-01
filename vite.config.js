import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/search': {
          target: 'https://serpapi.com',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost')
            const q = url.searchParams.get('q') || ''
            return `/search.json?engine=google_images&q=${encodeURIComponent(q)}&api_key=${env.VITE_SERPAPI_KEY}`
          },
        },
      },
    },
  }
})
