import * as Sentry from '@sentry/browser'

const Plugin = {
  errorHandler: null,
  install: app => {
    const $errorHandler = {
      captureError(error, tags = {}) {
        Sentry.withScope(scope => {
          if (Object.keys(tags)) {
            scope.setTags(tags)
          }

          Sentry.captureException(error)
        })
      }
    }

    app.config.globalProperties.$errorHandler = $errorHandler

    Plugin.errorHandler = $errorHandler
  }
}

export default Plugin

export function useErrorHandler() {
  return Plugin.errorHandler
}
