import { createApp } from 'vue'
import App from './App.vue'
import BaseButton from './components/base/BaseButton'
import BaseIcon from './components/base/BaseIcon'
import BaseModalHeader from './components/base/BaseModalHeader'
import BaseModalTitle from './components/base/BaseModalTitle'
import BaseModalBody from './components/base/BaseModalBody'
import BaseModalFooter from './components/base/BaseModalFooter'
import GlobalSheetModal from './plugins/global-sheet-modal'
import './registerServiceWorker'
import router from './router'
import store from './store'
import i18n from './i18n'

createApp(App)
  .component('BaseButton', BaseButton)
  .component('BaseIcon', BaseIcon)
  .component('BaseModalHeader', BaseModalHeader)
  .component('BaseModalTitle', BaseModalTitle)
  .component('BaseModalBody', BaseModalBody)
  .component('BaseModalFooter', BaseModalFooter)
  .use(store)
  .use(GlobalSheetModal)
  .use(router)
  .use(i18n)
  .mount('#app')
