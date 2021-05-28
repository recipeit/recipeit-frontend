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
        __SENTRY_RELEASE__: JSON.stringify(commitHash)
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
    name: 'My App',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
}
