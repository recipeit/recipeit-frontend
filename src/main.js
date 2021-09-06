import { createMetaManager, defaultConfig } from 'vue-meta'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { createApp } from 'vue'
import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'
import './registerServiceWorker'
import App from './App'
import GlobalSheetModal from './plugins/global-sheet-modal'
import Clipboard from './plugins/clipboard'
import Progressbar from './plugins/progressbar'
import Toast from './plugins/toast'
import error from './error'
import router from './router'
import store from './store'
import i18n from './i18n'
import blurOnClick from './directives/blurOnClick'
import autofocus from './directives/autofocus'

const useSentry = process.env.NODE_ENV === 'production'

if (useSentry) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    release: process.env.VUE_APP_VERSION,
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
  .use(VTooltip)
  .use(GlobalSheetModal)
  .use(Clipboard)
  .use(Progressbar, progressbarOptions)
  .use(Toast)
  .use(error)
  .use(router)
  .use(store)
  .use(i18n)
  .use(
    createMetaManager(false, {
      ...defaultConfig,
      meta: { tag: 'meta', nameless: true }
    })
  )
  .directive('blur-on-click', blurOnClick)
  .directive('autofocus', autofocus)

if (useSentry) {
  app.config.errorHandler = (error, instance, info) => {
    Sentry.withScope(scope => {
      scope.setTag('info', info)
      Sentry.captureException(error)
    })
  }
  // window.addEventListener('error', event => {
  //   Sentry.captureException(event)
  // })
  // window.addEventListener('unhandledrejection', event => {
  //   Sentry.captureException(event)
  // })
}

app.mount('#app')
