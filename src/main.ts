import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager, defaultConfig } from 'vue-meta'
import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'

import { RecipeitGlobalComponents } from '@/components/base'

import autofocus from '@/directives/autofocus'
import blurOnClick from '@/directives/blurOnClick'

import error from '@/error'

import i18n from '@/i18n'

import Clipboard from '@/plugins/clipboard'
import GlobalSheetModal from '@/plugins/global-sheet-modal'
import Progressbar from '@/plugins/progressbar'
import Toast from '@/plugins/toast'

import router from '@/router'

import App from '@/App.vue'

const useSentry = process.env.NODE_ENV === 'production'

if (useSentry) {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    release: process.env.VUE_APP_VERSION,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0
  })
}

const app = createApp(App)

Object.entries(RecipeitGlobalComponents).forEach(([name, component]) => {
  app.component(name, component)
})

app
  .use(VTooltip)
  .use(GlobalSheetModal)
  .use(Clipboard)
  .use(Progressbar, {
    color: 'var(--color-primary)'
  })
  .use(Toast)
  .use(error)
  .use(router)
  .use(createPinia())
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
