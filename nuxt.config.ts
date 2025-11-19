import { defineNuxtConfig } from 'nuxt/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-11-19',
  ssr: false,
  typescript: {
    strict: true,
    typeCheck: true
  },

  modules: ['@pinia/nuxt'],

  css: ['@/assets/styles/main.scss'],

  components: [
    {
      path: '~/components/atoms',
      prefix: 'Atoms'
    },
    {
      path: '~/components/molecules',
      prefix: 'Molecules'
    },
    {
      path: '~/components/organisms',
      prefix: 'Organisms'
    }
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
        '~': path.resolve(__dirname)
      }
    }
  }
})
