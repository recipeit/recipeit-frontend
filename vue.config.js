const SentryWebpackPlugin = require('@sentry/webpack-plugin')
// const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')
const { execSync } = require('child_process')
const { buildMarkdowns } = require('./src/markdowns')

const isProduction = process.env.NODE_ENV === 'production'

buildMarkdowns(!isProduction)

process.env.VUE_APP_VERSION = execSync('git rev-parse HEAD')
  .toString()
  .trim()

const baseUrl = 'https://recipeit.pl'

module.exports = {
  pluginOptions: {
    sitemap: {
      defaults: {
        lastmod: new Date().toISOString()
      },
      urls: [
        `${baseUrl}/`,
        `${baseUrl}/logowanie`,
        `${baseUrl}/rejestracja`,
        `${baseUrl}/dodaj-blog`,
        `${baseUrl}/regulamin`,
        `${baseUrl}/polityka-prywatnosci`,
        `${baseUrl}/kontakt`
      ]
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @use 'sass:math';
          @import '@/styles/non-rendered';
        `
      }
    }
  },
  configureWebpack: config => {
    config.devtool = 'source-map'

    // config.plugins.push(
    //   new GoogleFontsPlugin({
    //     noLocalInCss: true,
    //     filename: 'fonts.10.css',
    //     fonts: [
    //       {
    //         family: 'Montserrat',
    //         display: 'swap',
    //         variants: ['500', '600', '700'],
    //         subsets: ['latin', 'latin-ext'],
    //       }
    //     ]
    //   })
    // )

    if (isProduction) {
      config.plugins.push(
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.VUE_APP_SENTRY_ORG,
          project: process.env.VUE_APP_SENTRY_PROJECT,
          release: process.env.VUE_APP_VERSION,
          include: './dist',
          ignore: ['node_modules', 'vue.config.js']
        })
      )
    }
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    https: true
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/^\?inline/)
      .use('svg-inline-loader')
      .loader('svg-inline-loader')
      .options({ functional: true })
      .end()
      .end()
      .oneOf('external')
      .use('file')
      .loader('file-loader')
      .options({ name: 'img/[name].[hash:8].[ext]' })
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Recipeit - Znajdź przepis ze swoich produktów'
    }
  },
  pwa: {
    manifestOptions: {
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
        'Znajdź przepis ze swoich produktów! Nie pozwól aby Twoje produkty się przeterminowały. Recipeit pokaże Ci, co możesz z nich przygotować.',
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
    },
    themeColor: null,
    msTileColor: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon48: 'pwa/icons/favicon-48x48.png',
      favicon32: 'pwa/icons/favicon-32x32.png',
      favicon16: 'pwa/icons/favicon-16x16.png',
      appleTouchIcon: 'pwa/icons/apple-touch-icon-152x152.png',
      maskIcon: 'pwa/icons/safari-pinned-tab.svg',
      msTileImage: 'pwa/icons/msapplication-icon-144x144.png'
    }
  },
  transpileDependencies: ['vue-meta']
}
