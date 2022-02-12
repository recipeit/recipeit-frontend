import { Ref } from 'vue'

export type ToastInstance = {
  id: number
  message: string
  type: ToastType
  seconds: number
  cancellable?: boolean
  onCancel?: () => void
}

export interface IToastContainer {
  toasts: Ref<Array<ToastInstance>>
  appendToast: (message: string, type: ToastType, seconds: number) => void
  appendCancellableToast: (message: string, type: ToastType, seconds: number, cancelCallback: () => void) => void
  removeToast: (id: ToastInstance['id']) => void
}

export type ToastPlugin = {
  _setGlobalToastsContainer: (container: IToastContainer) => void
  show: (message: string, type?: ToastType, seconds?: number) => void
  showCancellable: (message: string, cancelCallback: () => void, type?: ToastType, seconds?: number) => void
  hide: (id: ToastInstance['id']) => void
}

export type ToastType = 'info' | 'success' | 'warning' | 'error'
