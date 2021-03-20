module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import '@/styles/non-rendered';`
      }
    }
  },
  configureWebpack: {
    title: 'Recipeit',
    devtool: 'source-map'
  }
}
