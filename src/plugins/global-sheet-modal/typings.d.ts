import { ComputedRef, Ref } from 'vue'

export type ModalInstanceProps = { [key: string]: unknown }

export type ModalInstanceEvents = { [key: string]: (...props: Array<any>) => void }

export type ModalInstanceOptions = { blockCloseOnBackdrop?: boolean }

export type ModalInstance = {
  id: string
  opened: boolean
  component: Component
  props: ModalInstanceProps
  events: ModalInstanceEvents
  blockCloseOnBackdrop: boolean
}

export interface IGlobalModalContainer {
  // data
  modals: Ref<Array<ModalInstance>>
  // methods
  add: (component: Component, props: ModalInstanceProps, events: ModalInstanceEvents, options?: ModalInstanceOptions) => void
  remove: (id: ModalInstance['id']) => void
  open: (id: ModalInstance['id']) => void
  close: (id: ModalInstance['id']) => void
  afterModalTransitionLeave: (id: ModalInstance['id']) => void
  getAnyModalOpened: () => boolean
  getModals: () => Array<ModalInstance>
}

export type GlobalSheetModalOptions = {
  globalModalContainer: IGlobalModalContainer
}

export type GlobalSheetModalPlugin = {
  _setGlobalModalContainer: (container: IGlobalModalContainer) => void
  show: (component: Component, props: ModalInstanceProps, events: ModalInstanceEvents, options?: ModalInstanceOptions) => void
  hide: (id: ModalInstance['id']) => void
  anyModalOpened: () => boolean
  hideLast: () => void
}
