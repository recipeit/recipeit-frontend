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
  devServer: {
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
  }
}
