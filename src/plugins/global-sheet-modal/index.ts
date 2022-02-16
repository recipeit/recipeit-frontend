import { App } from 'vue'

import GlobalModalContainer from '@/plugins/global-sheet-modal/GlobalModalContainer.vue'
import ModalContent from '@/plugins/global-sheet-modal/ModalContent.vue'

import { GlobalSheetModalOptions, GlobalSheetModalPlugin } from './typings'

const Plugin = {
  modal: null as GlobalSheetModalPlugin,
  install: (app: App) => {
    const usedOptions: GlobalSheetModalOptions = {
      globalModalContainer: null
    }

    const $modal: GlobalSheetModalPlugin = {
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
        if (usedOptions.globalModalContainer === null) {
          console.warn('[global-sheet-modal] Global modal container is not present')
        } else {
          usedOptions.globalModalContainer.remove(id)
        }
      },
      anyModalOpened() {
        return !!usedOptions.globalModalContainer?.getAnyModalOpened()
      },
      hideLast() {
        if (usedOptions.globalModalContainer === null) {
          console.warn('[global-sheet-modal] Global modal container is not present')
        } else {
          const openedModals = usedOptions.globalModalContainer.getModals().filter(({ opened }) => opened)
          if (openedModals.length > 0) {
            const { id } = openedModals[openedModals.length - 1]
            usedOptions.globalModalContainer.remove(id)
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

export const useModal = () => Plugin.modal
