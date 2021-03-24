import ToastsContainer from './ToastsContainer'

const Plugin = {
  toast: null,
  install: app => {
    let globalToastsContainer

    const $toast = {
      _setGlobalToastsContainer(container) {
        globalToastsContainer = container
      },
      show(message, type = 'info', seconds) {
        if (!globalToastsContainer) {
          console.warn('[toasts-container] Global Toasts Container is not present')
        } else {
          globalToastsContainer.appendToast(message, type, seconds)
        }
      },
      hide(id) {
        if (!globalToastsContainer) {
          console.warn('[toasts-container] Global Toasts Container is not present')
        } else {
          globalToastsContainer.removeToast(id)
        }
      }
    }
    app.config.globalProperties.$toast = $toast

    app.component(ToastsContainer.name, ToastsContainer)

    Plugin.toast = $toast
  }
}

export default Plugin
