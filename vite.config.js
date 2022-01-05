import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'child_process'
import { buildMarkdowns } from './src/markdowns'
import { VitePWA } from 'vite-plugin-pwa'
import viteSentry from 'vite-plugin-sentry'
import svgLoader from 'vite-svg-loader'
import path from 'path'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const isProduction = process.env.NODE_ENV === 'production'

  buildMarkdowns(!isProduction)

  process.env.VUE_APP_VERSION = execSync('git rev-parse HEAD')
    .toString()
    .trim()

  let plugins = [
    vue(),
    svgLoader(),
    VitePWA({
      // themeColor: null,
      // msTileColor: '#FFFFFF',
      // appleMobileWebAppCapable: 'yes',
      // appleMobileWebAppStatusBarStyle: 'black',
      // iconPaths: {
      //   favicon48: 'pwa/icons/favicon-48x48.png',
      //   favicon32: 'pwa/icons/favicon-32x32.png',
      //   favicon16: 'pwa/icons/favicon-16x16.png',
      //   appleTouchIcon: 'pwa/icons/apple-touch-icon-152x152.png',
      //   maskIcon: 'pwa/icons/safari-pinned-tab.svg',
      //   msTileImage: 'pwa/icons/msapplication-icon-144x144.png'
      // },
      base: '/',
      srcDir: 'src',
      filename: 'service-worker.js',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Recipeit',
        short_name: 'Recipeit',
        start_url: 'https://recipeit.pl',
        theme_color: '#FFFFFF',
        display: 'standalone',
        background_color: '#FFFFFF',
        icons: [
          {
            src: '/pwa/icons/favicon-48x48.png',
            type: 'image/png',
            sizes: '48x48'
          },
          {
            src: '/pwa/icons/android-chrome-192x192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: '/pwa/icons/android-chrome-512x512.png',
            type: 'image/png',
            sizes: '512x512'
          },
          {
            src: '/pwa/icons/pwa-maskable-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any maskable'
          },
          {
            src: '/pwa/icons/pwa-maskable-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any maskable'
          }
        ],
        description:
          'Znajdź przepis ze swoich składników spożywczych! Nie pozwól aby Twoje produkty się przeterminowały. Recipeit pokaże Ci, co możesz przygotować z tego co masz w lodówce i w kuchni.',
        screenshots: [
          {
            src: '/pwa/screenshots/recipe.jpg',
            type: 'image/png',
            sizes: '750x1440'
          },
          {
            src: '/pwa/screenshots/recipes.jpg',
            type: 'image/png',
            sizes: '750x1440'
          },
          {
            src: '/pwa/screenshots/kitchen.jpg',
            type: 'image/png',
            sizes: '750x1440'
          }
        ],
        categories: ['food', 'shopping', 'productivity']
      }
    })
  ]

  if (isProduction) {
    plugins.push(
      viteSentry({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.VITE_SENTRY_ORG,
        project: process.env.VITE_SENTRY_PROJECT,
        release: process.env.VUE_APP_VERSION,
        include: './dist',
        ignore: ['node_modules', 'vite.config.js']
      })
    )
  }

  return defineConfig({
    plugins,

    server: {
      host: 'localhost',
      port: 8080,
      https: true
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'sass:math';
            @import '@/styles/non-rendered';
          `
        }
      }
    },

    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        }
      ]
    },

    build: {
      sourcemap: 'hidden'
    }
  })
}
