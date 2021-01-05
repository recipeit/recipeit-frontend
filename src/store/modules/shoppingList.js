import shoppingListApi from '@/api/shoppingListApi'

export default {
  namespaced: true,
  state: {
    products: null
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    ADD_PRODUCT(state, product) {
      if (!state.products) {
        state.products = [product]
      } else {
        state.products.push(product)
      }
    },
    UPDATE_PRODUCT_FROM_SHOPPING_LIST(state, product) {
      var productIndex = state.products.findIndex(p => p.id === product.id)
      if (productIndex >= 0) {
        for (var prop in product) {
          if (Object.prototype.hasOwnProperty.call(product, prop)) {
            state.products[productIndex][prop] = product[prop]
          }
        }
      }
    },
    REMOVE_PRODUCT_FROM_SHOPPING_LIST(state, id) {
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
        commit('SET_PRODUCTS', resp.data)
      })
    },
    addProduct({ commit }, product) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .addProductToShoppingList(product)
          .then(resp => {
            commit('ADD_PRODUCT', resp.data)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    editProductFromShoppingList({ commit }, product) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .updateProductFromShoppingList(product)
          .then(resp => {
            commit('UPDATE_PRODUCT_FROM_SHOPPING_LIST', resp.data)
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
            commit('REMOVE_PRODUCT_FROM_SHOPPING_LIST', id)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    purchaseProduct({ commit }, productId) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .purchaseProduct(productId)
          .then(() => {
            commit('REMOVE_PRODUCT_FROM_SHOPPING_LIST', productId)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    purchaseAllProducts({ commit }) {
      return new Promise((resolve, reject) => {
        shoppingListApi
          .purchaseAllProducts()
          .then(() => {
            commit('SET_PRODUCTS', [])
            resolve()
          })
          .catch(error => reject(error))
      })
    }
  }
}
