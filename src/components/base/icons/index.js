import kebabCase from 'lodash.kebabcase'

const components = {}

const icons = import.meta.globEager('./*.svg')

Object.entries(icons).forEach(([path, { default: component }]) => {
  const name = path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
    .split(/\s+/)

  const weight = kebabCase(name[0])
  const icon = kebabCase(name[1])

  if (!(weight in components)) components[weight] = {}

  components[weight][icon] = component
})

export default components
