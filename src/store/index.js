import { createStore } from 'vuex'
import myKitchen from './modules/myKitchen'
import recipes from './modules/recipes'
import shoppingList from './modules/shoppingList'
import user from './modules/user'

export default createStore({
  modules: {
    myKitchen,
    recipes,
    shoppingList,
    user
  }
})
