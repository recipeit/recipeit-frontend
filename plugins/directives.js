import { defineNuxtPlugin } from '#app'
import { useRouter } from 'vue-router'

import camelCase from 'lodash.camelcase'
import upperFirst from 'lodash.upperfirst'

import i18n from '@/src/i18n'
import store from '@/src/store'

import autofocus from '@/src/directives/autofocus'
import blurOnClick from '@/src/directives/blurOnClick'

export default defineNuxtPlugin(nuxtApp => {
  const router = nuxtApp.$router

  nuxtApp.vueApp
    .use(store({ router }))
    .use(i18n)
    .directive('blur-on-click', blurOnClick)
    .directive('autofocus', autofocus)

  const requireComponent = require.context('../src/components/base', false, /\w+\.(vue|js)$/)
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = upperFirst(
      camelCase(
        fileName
          .split('/')
          .pop()
          .replace(/\.\w+$/, '')
      )
    )
    nuxtApp.vueApp.component(componentName, componentConfig.default || componentConfig)
  })
})
