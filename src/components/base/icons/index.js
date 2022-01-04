import kebabCase from 'lodash.kebabcase'

const components = {}

const icons = import.meta.globEager('./*.svg')

Object.entries(icons).forEach(async ([path, definition]) => {
  const name = path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
    .split(/\s+/)

  const weight = kebabCase(name[0])
  const icon = kebabCase(name[1])

  if (!(weight in components)) components[weight] = {}

  const fetchedIcon = await import(`${definition.default}?raw`)
  components[weight][icon] = fetchedIcon.default
})

export default components
