import GlobalModalContainer from './GlobalModalContainer'
import ModalContent from './ModalContent'

const defaultOptions = {
  globalModalContainer: null
}

const Plugin = {
  install: (app, options = {}) => {
    var usedOptions = {
      ...defaultOptions,
      ...options
    }

    const $modal = {
      _setGlobalModalContainer(container) {
        usedOptions.globalModalContainer = container
      },
      show(component, props, events) {
        if (usedOptions.globalModalContainer == null) {
          console.warn('[global-sheet-modal] Global modal container is not present')
        } else {
          usedOptions.globalModalContainer.add(component, props, events)
        }
      },
      hide(id) {
        if (usedOptions.globalModalContainer == null) {
          console.warn('[global-sheet-modal] Global modal container is not present')
        } else {
          usedOptions.globalModalContainer.remove(id)
        }
      }
    }
    app.config.globalProperties.$modal = $modal

    app.component(GlobalModalContainer.name, GlobalModalContainer)
    app.component(ModalContent.name, ModalContent)
  }
}

export default Plugin
