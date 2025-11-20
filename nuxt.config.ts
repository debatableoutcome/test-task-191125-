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
  experimental: {
    appManifest: false
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Простые заметки со списками задач' }
      ],
      title: 'Заметки'
    }
  },
  modules: ['@pinia/nuxt'],
  css: ['@/assets/styles/main.scss'],
  components: [
    {
      path: '~/app/components/atoms',
      prefix: 'Atoms'
    },
    {
      path: '~/app/components/molecules',
      prefix: 'Molecules'
    },
    {
      path: '~/app/components/organisms',
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
