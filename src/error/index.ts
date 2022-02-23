import { withScope as sentryWithScope, captureException as sentryCaptureException } from '@sentry/browser'
import { Primitive } from '@sentry/types'
import { App } from 'vue'

type CapturedError = Error | string | object

type ErrorHandler = {
  captureError: (error: CapturedError, tags: { [key: string]: Primitive }) => void
}

type ErrorHandlerPlugin = {
  errorHandler: ErrorHandler
  install: (app: App) => void
}

const Plugin: ErrorHandlerPlugin = {
  errorHandler: null,
  install: app => {
    const $errorHandler: ErrorHandler = {
      captureError(error: CapturedError, tags = {}) {
        sentryWithScope(scope => {
          if (Object.keys(tags)) {
            scope.setTags(tags)
          }

          sentryCaptureException(error)
        })
      }
    }

    app.config.globalProperties.$errorHandler = $errorHandler

    Plugin.errorHandler = $errorHandler
  }
}

export default Plugin

export const useErrorHandler = () => Plugin.errorHandler
