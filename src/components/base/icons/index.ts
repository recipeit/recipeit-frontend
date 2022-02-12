import kebabCase from 'lodash.kebabcase'

import { IconSet } from '@/typings/icons'

const components: IconSet = {}

const icons = import.meta.globEager('./*.svg')

Object.entries(icons).forEach(([path, { default: component }]) => {
  const [weightCamel, iconCamel] = path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
    .split(/\s+/)

  const weight = kebabCase(weightCamel)
  const icon = kebabCase(iconCamel)

  if (!(weight in components)) components[weight] = {}

  components[weight][icon] = component
})

export default components
