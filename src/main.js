import { upperFirst, camelCase } from 'lodash'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { createApp } from 'vue'
import './registerServiceWorker'
import App from './App'
import GlobalSheetModal from './plugins/global-sheet-modal'
import Clipboard from './plugins/clipboard'
import Progressbar from './plugins/progressbar'
import Toast from './plugins/toast'
import router from './router'
import store from './store'
import i18n from './i18n'
import blurOnClick from './directives/blurOnClick'
import autofocus from './directives/autofocus'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://4b843710aac44608b16ad0f7b80b02c0@o662244.ingest.sentry.io/5765240',
    release: 'recipeit@0.71',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0
  })
}

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

const progressbarOptions = {
  color: 'var(--color-primary)'
}

app
  .use(GlobalSheetModal)
  .use(Clipboard)
  .use(Progressbar, progressbarOptions)
  .use(Toast)
  .use(router)
  .use(store)
  .use(i18n)
  .directive('blur-on-click', blurOnClick)
  .directive('autofocus', autofocus)

if (process.env.NODE_ENV === 'production') {
  app.config.errorHandler = err => {
    Sentry.captureException(err)
  }
  window.addEventListener('error', event => {
    Sentry.captureException(event)
  })
  window.addEventListener('unhandledrejection', event => {
    Sentry.captureException(event)
  })
}

app.mount('#app')
