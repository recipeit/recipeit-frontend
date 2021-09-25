import recipeApi from '@/api/recipeApi'
import shoppingListApi from '@/api/shoppingListApi'
import eventHub from '@/services/eventHub'

export const MUTATIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  ADD_PRODUCTS: 'ADD_PRODUCTS',
  UPDATE_PRODUCT_FROM_SHOPPING_LIST: 'UPDATE_PRODUCT_FROM_SHOPPING_LIST',
  REMOVE_PRODUCT_FROM_SHOPPING_LIST: 'REMOVE_PRODUCT_FROM_SHOPPING_LIST'
}

export default {
  namespaced: true,
  state: {
    products: null
  },
  mutations: {
    [MUTATIONS.SET_PRODUCTS](state, products) {
      state.products = products
    },
    [MUTATIONS.ADD_PRODUCT](state, product) {
      if (!state.products) {
        state.products = [product]
      } else {
        var existingIndex = state.products.findIndex(({ id }) => id === product.id)

        if (existingIndex >= 0) {
          Object.entries(product).forEach(([key, value]) => {
            state.products[existingIndex][key] = value
          })
        } else {
          state.products.push(product)
        }
      }
    },
    [MUTATIONS.ADD_PRODUCTS](state, products) {
      if (!state.products) {
        state.products = products
      } else {
        var newProductsIds = products.map(({ id }) => id)
        var currentProductsWithoutUpdated = state.products.filter(({ id }) => !newProductsIds.includes(id))
        state.products = currentProductsWithoutUpdated.concat(products)
      }
    },
    [MUTATIONS.UPDATE_PRODUCT_FROM_SHOPPING_LIST](state, product) {
      var productIndex = state.products.findIndex(p => p.id === product.id)
      if (productIndex >= 0) {
        Object.entries(product).forEach(([key, value]) => {
          state.products[productIndex][key] = value
        })
      }
    },
    [MUTATIONS.REMOVE_PRODUCT_FROM_SHOPPING_LIST](state, id) {
      var productIndex = state.products.findIndex(p => p.id === id)
      if (productIndex >= 0) {
        state.products.splice(productIndex, 1)
      }
    }
  },
  actions: {
    fetchProducts({ state, commit }) {
      if (state.products !== null) return
      shoppingListApi.getProductsFromShoppingList().then(resp => {
        commit(MUTATIONS.SET_PRODUCTS, resp.data)
      })
    },
    addProduct({ commit }, product) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .addProductToShoppingList(product)
          .then(resp => {
            commit(MUTATIONS.ADD_PRODUCT, resp.data)
            eventHub.$emit('add-to-shopping-list')
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    addMissingIngredientsToShoppingList({ commit }, recipeId) {
      return new Promise((resolve, reject) => {
        recipeApi
          .addMissingIngredientsToShoppingList(recipeId)
          .then(({ data: products }) => {
            if (products) {
              commit(MUTATIONS.ADD_PRODUCTS, products)
              eventHub.$emit('add-to-shopping-list')
            }
            resolve(products)
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    editProductFromShoppingList({ commit }, product) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .updateProductFromShoppingList(product)
          .then(resp => {
            commit(MUTATIONS.UPDATE_PRODUCT_FROM_SHOPPING_LIST, resp.data)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    deleteProductFromShoppingList({ commit }, id) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .removeProductFromShoppingListById(id)
          .then(() => {
            commit(MUTATIONS.REMOVE_PRODUCT_FROM_SHOPPING_LIST, id)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    purchaseProduct({ commit, dispatch }, productId) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .purchaseProduct(productId)
          .then(({ data }) => {
            commit(MUTATIONS.REMOVE_PRODUCT_FROM_SHOPPING_LIST, productId)

            const { newKitchenProduct } = data
            dispatch('myKitchen/includeProductToList', newKitchenProduct, { root: true })

            resolve()
          })
          .catch(error => reject(error))
      })
    },
    purchaseAllProducts({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .purchaseAllProducts()
          .then(({ data }) => {
            commit(MUTATIONS.SET_PRODUCTS, [])

            const { newKitchenProducts: kitchenProducts } = data
            dispatch('myKitchen/includeProductsToList', kitchenProducts, { root: true })

            resolve()
          })
          .catch(error => reject(error))
      })
    },
    resetUserData({ commit }) {
      commit(MUTATIONS.SET_PRODUCTS, null)
    }
  }
}
