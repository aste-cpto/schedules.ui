import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcPath = path.resolve(__dirname, 'src')

function tildeAliasPlugin(): Plugin {
  return {
    name: 'tilde-alias',
    resolveId(source) {
      if (source.startsWith('~/')) {
        return path.resolve(srcPath, source.slice(2))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tildeAliasPlugin(), react(), tailwindcss()],
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '~': srcPath,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [srcPath],
      },
    },
  },
})
