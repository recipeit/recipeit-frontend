/**
 * This is the original RegExp cloned from the original Nuxt.js configuration
 * files, with only the search for ".svg" files removed. Keep tabs on this in
 * case the core decides to add additional qualifiers to the pattern.
 */
const ORIGINAL_TEST = /\.(png|jpe?g|gif|svg|webp)$/i
const REPLACEMENT_TEST = /\.(png|jpe?g|gif|webp)$/i

export default function svgModule(moduleOptions) {
  const options = Object.assign({}, this.options.svg, moduleOptions)
  this.extendBuild(setup.bind(this, options))
}

/**
 * Perform the primary setup for the nuxt-svg module by removing and replacing
 * all of the rules that match ".svg" with the new one.
 *
 * @param options The module options
 * @param config The webpack configuration object to extend
 */
function setup(options, config) {
  const rules = config.module.rules

  // Remove any original svg rules.
  const svgRules = rules.filter(rule => rule.test && rule.test.test('.svg'))

  for (const rule of svgRules) {
    if (rule.test.source === ORIGINAL_TEST.source) {
      rule.test = REPLACEMENT_TEST
    }
    if (rule.test.source === /\.svg$/i.source) {
      return
    }
  }

  const vueSvgLoader = [
    {
      loader: 'raw-loader',
      options: options.vueSvgLoader || { esModule: true }
    }
  ]

  //  if (config.name !== "server") {
  //    const jsxRule = config.module.rules.find((r) => r.test.test(".jsx"));
  //    const babelLoader = jsxRule.use[jsxRule.use.length - 1];
  //    vueSvgLoader.unshift(babelLoader);
  //  }

  /**
   * Create the custom rule that supports multiple resource queries. By default,
   * use file-loader (no resource query supplied).
   */
  const rule = {
    test: /\.svg$/i,
    oneOf: [
      {
        resourceQuery: /inline/,
        use: vueSvgLoader
      },
      {
        use: {
          loader: 'file-loader',
          options: { name: 'img/[name].[hash:8].[ext]' }
        }
      }
    ]
  }

  rules.push(rule) // Add the rule to the configuration.
}
