import GlobalModalContainer from '@/plugins/global-sheet-modal/GlobalModalContainer.vue'
import ModalContent from '@/plugins/global-sheet-modal/ModalContent.vue'

const defaultOptions = {
  globalModalContainer: null
}

const Plugin = {
  modal: null,
  install: (app, options = {}) => {
    const usedOptions = {
      ...defaultOptions,
      ...options
    }

    const $modal = {
      _setGlobalModalContainer(container) {
        usedOptions.globalModalContainer = container
      },
      show(component, props, events, options) {
        if (usedOptions.globalModalContainer == null) {
          console.warn('[global-sheet-modal] Global modal container is not present')
        } else {
          usedOptions.globalModalContainer.add(component, props, events, options)
        }
      },
      hide(id) {
        if (usedOptions.globalModalContainer == null) {
          console.warn('[global-sheet-modal] Global modal container is not present')
        } else {
          usedOptions.globalModalContainer.remove(id)
        }
      },
      anyModalOpened() {
        if (usedOptions.globalModalContainer == null) {
          return false
        } else {
          return usedOptions.globalModalContainer.anyModalOpened
        }
      },
      hideLast() {
        if (usedOptions.globalModalContainer == null) {
          console.warn('[global-sheet-modal] Global modal container is not present')
        } else {
          const openedModals = usedOptions.globalModalContainer.modals.filter(m => m.opened)
          if (openedModals && openedModals.length > 0) {
            const lastModal = openedModals[openedModals.length - 1]
            usedOptions.globalModalContainer.remove(lastModal.id)
          }
        }
      }
    }
    app.config.globalProperties.$modal = $modal

    app.component(GlobalModalContainer.name, GlobalModalContainer)
    app.component(ModalContent.name, ModalContent)

    Plugin.modal = $modal
  }
}

export default Plugin

export function useModal() {
  return Plugin.modal
}
