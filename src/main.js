import { createApp } from 'vue'
import App from './App.vue'
import BaseButton from './components/base/BaseButton'
import BaseIcon from './components/base/BaseIcon'
import './registerServiceWorker'
import router from './router'
import store from './store'

createApp(App)
  .component('BaseButton', BaseButton)
  .component('BaseIcon', BaseIcon)
  .use(store)
  .use(router)
  .mount('#app')
