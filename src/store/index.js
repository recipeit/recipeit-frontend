import { createStore } from 'vuex'

import ingredients from '@/store/modules/ingredients'
import myKitchen from '@/store/modules/myKitchen'
import recipes from '@/store/modules/recipes'
import shoppingList from '@/store/modules/shoppingList'
import user from '@/store/modules/user'

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
