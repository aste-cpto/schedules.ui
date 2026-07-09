import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcPath = path.resolve(__dirname, 'src')

const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs']
const INDEX_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

function resolveTildeImport(source: string): string | null {
  if (!source.startsWith('~/')) return null

  const basePath = path.resolve(srcPath, source.slice(2))

  for (const extension of FILE_EXTENSIONS) {
    const filePath = `${basePath}${extension}`
    if (fs.existsSync(filePath)) return filePath
  }

  if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
    for (const extension of INDEX_EXTENSIONS) {
      const indexPath = path.join(basePath, `index${extension}`)
      if (fs.existsSync(indexPath)) return indexPath
    }
  }

  return null
}

function tildeAliasPlugin(): Plugin {
  return {
    name: 'tilde-alias',
    resolveId(source) {
      return resolveTildeImport(source)
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
