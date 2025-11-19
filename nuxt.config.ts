import { defineNuxtConfig } from 'nuxt/config'
import path from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2025-11-19',
  ssr: false,
  typescript: {
    strict: true,
    typeCheck: true
  },
  modules: ['@pinia/nuxt'],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
        '~': path.resolve(__dirname)
      }
    }
  }
})
