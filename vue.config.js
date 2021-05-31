const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { DefinePlugin } = require('webpack')
const { execSync } = require('child_process')

const commitHash = execSync('git rev-parse HEAD').toString()

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @use 'sass:math';
          @import '@/styles/non-rendered';
        `
      }
    }
  },
  configureWebpack: config => {
    config.devtool = 'source-map'

    config.plugins.push(
      new DefinePlugin({
        __BUILD_VERSION__: JSON.stringify(commitHash)
      })
    )

    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'recipeit',
          project: 'recipeit',
          release: commitHash,
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
      title: 'Recipeit - Znajdź przepis z tego co masz!'
    }
  },
  pwa: {
    manifestOptions: {
      name: 'Recipeit',
      short_name: 'Recipeit',
      start_url: '.',
      theme_color: '#FFFFFF',
      display: 'standalone',
      background_color: '#FFFFFF',
      icons: [
        {
          src: '/img/icons/android-chrome-192x192.png',
          type: 'image/png',
          sizes: '192x192'
        },
        {
          src: '/img/icons/android-chrome-512x512.png',
          type: 'image/png',
          sizes: '512x512'
        },
        {
          src: '/img/icons/android-chrome-maskable-192x192.png',
          type: 'image/png',
          sizes: '192x192',
          purpose: 'maskable'
        },
        {
          src: '/img/icons/android-chrome-maskable-512x512.png',
          type: 'image/png',
          sizes: '512x512',
          purpose: 'maskable'
        }
      ]
    },
    themeColor: '#FFFFFF',
    msTileColor: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: '/img/icons/favicon-32x32.png',
      favicon16: '/img/icons/favicon-16x16.png',
      appleTouchIcon: '/img/icons/apple-touch-icon-152x152.png',
      maskIcon: '/img/icons/safari-pinned-tab.svg',
      msTileImage: '/img/icons/msapplication-icon-144x144.png'
    }
  }
}
