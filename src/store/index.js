import { createStore } from 'vuex'

import ingredients from '@/src/store/modules/ingredients'
import myKitchen from '@/src/store/modules/myKitchen'
import recipes from '@/src/store/modules/recipes'
import shoppingList from '@/src/store/modules/shoppingList'
import user from '@/src/store/modules/user'

export default config => createStore({
  modules: {
    ingredients: ingredients(config),
    myKitchen: myKitchen(config),
    recipes: recipes(config),
    shoppingList: shoppingList(config),
    user: user(config)
  },
  devtools: false
  // plugins: [createLogger()]
})
