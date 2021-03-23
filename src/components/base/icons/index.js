import kebabCase from 'lodash.kebabcase'

const components = {}

const requireTemplate = require.context('.?inline', false, /\.svg$/)

requireTemplate.keys().forEach(fileName => {
  const name = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
    .split(/\s+/)

  const weight = kebabCase(name[0])
  const icon = kebabCase(name[1])

  if (!(weight in components)) components[weight] = {}

  components[weight][icon] = requireTemplate(fileName)
})

export default components
