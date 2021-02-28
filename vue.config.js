module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import '@/styles/non-rendered';`
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
