const SentryWebpackPlugin = require('@sentry/webpack-plugin')

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
  configureWebpack: {
    devtool: 'source-map',
    plugins:
      process.env.NODE_ENV === 'production'
        ? [
            new SentryWebpackPlugin({
              // sentry-cli configuration
              authToken: process.env.SENTRY_AUTH_TOKEN,
              org: 'recipeit',
              project: 'recipeit',
              // release: process.env.SENTRY_RELEASE,
              release: 'recipeit@0.71',
              include: './dist',
              ignore: ['node_modules', 'vue.config.js']
            })
          ]
        : null
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
