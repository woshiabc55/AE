import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const versionPaths = [
  '/v1-core/', '/v2-chain/', '/v3-blend/', '/v4-interactive/',
  '/v5-plugin/', '/v6-physics3d/', '/v7-software-model/',
]

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: versionPaths.reduce((acc, path) => {
      acc[path] = {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
      return acc
    }, {} as Record<string, { target: string; changeOrigin: boolean }>),
  },
})
