import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import camelCase from 'lodash.camelcase'
import upperFirst from 'lodash.upperfirst'
import { createApp } from 'vue'
import { createMetaManager, defaultConfig } from 'vue-meta'
import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'

import autofocus from '@/directives/autofocus'
import blurOnClick from '@/directives/blurOnClick'

import error from '@/src/error'

import i18n from '@/src/i18n'

import Clipboard from '@/src/plugins/clipboard'
import GlobalSheetModal from '@/src/plugins/global-sheet-modal'
import Progressbar from '@/src/plugins/progressbar'
import Toast from '@/src/plugins/toast'

import '@/registerServiceWorker'

import router from '@/src/router'

import store from '@/store'

import App from '@/App'

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
