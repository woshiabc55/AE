import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const versionPaths = [
  '/v1-core/', '/v2-chain/', '/v3-blend/', '/v4-interactive/',
  '/v5-plugin/', '/v6-physics3d/', '/v7-software-model/',
]

const proxy: Record<string, { target: string; changeOrigin: boolean }> = {}

for (const path of versionPaths) {
  proxy[path] = { target: 'http://localhost:8081', changeOrigin: true }
}

proxy['/api'] = { target: 'http://localhost:4000', changeOrigin: true }

export default defineConfig({
  plugins: [vue()],
  server: { proxy },
})