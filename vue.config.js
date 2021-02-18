module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import '@/styles/styles.scss';`
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
