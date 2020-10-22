import { createStore } from 'vuex'
import user from './modules/user'
import recipe from './modules/recipe'

export default createStore({
  modules: {
    user,
    recipe
  }
})
