// import { createLogger, createStore } from 'vuex'
import { createStore } from 'vuex'
import ingredients from './modules/ingredients'
import myKitchen from './modules/myKitchen'
import recipes from './modules/recipes'
import shoppingList from './modules/shoppingList'
import user from './modules/user'

export default createStore({
  modules: {
    ingredients,
    myKitchen,
    recipes,
    shoppingList,
    user
  }
  // plugins: [createLogger()]
})
