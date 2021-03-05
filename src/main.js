import { upperFirst, camelCase } from 'lodash'
import { createApp } from 'vue'
import './registerServiceWorker'
import App from './App'
import GlobalSheetModal from './plugins/global-sheet-modal'
import router from './router'
import store from './store'
import i18n from './i18n'
import blurOnClick from './directives/blurOnClick'

const app = createApp(App)

const requireComponent = require.context('./components/base', false, /\w+\.(vue|js)$/)
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
  app.component(componentName, componentConfig.default || componentConfig)
})

app
  .use(GlobalSheetModal)
  .use(router)
  .use(store)
  .use(i18n)
  .directive('blur-on-click', blurOnClick)
  .mount('#app')
