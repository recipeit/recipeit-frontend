export default function directiveFixModule(moduleOptions) {
  const options = Object.assign({}, this.options.directiveFix, moduleOptions)
  this.extendBuild(setup.bind(this, options))
}

function setup(options, config) {
  const rules = config.module.rules

  const vueLoader = rules.filter(rule => rule.loader === 'vue-loader')[0]

  vueLoader.options.compilerOptions = {
    ...vueLoader.options.compilerOptions,
    directiveTransforms: {
      'blur-on-click': () => ({
        props: []
      }),
      autofocus: () => ({
        props: []
      })
    }
  }
}
