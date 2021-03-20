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
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Recipeit - Znajdź przepis z tego co masz!'
    }
  }
}
