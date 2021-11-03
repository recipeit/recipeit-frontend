import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  vite: false,

  build: {
    loaders: {
      scss: {
        additionalData: `
          @use 'sass:math';
          @import '@/src/styles/non-rendered';
        `
      }
    },
  },

  buildModules: [
    "~/modules/svg.js",
    "~/modules/directiveFix.js"
  ],

  modules: [
    // '@nuxtjs/markdownit'
  ]
})
