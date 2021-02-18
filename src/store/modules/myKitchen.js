import myKitchenApi from '@/api/myKitchenApi'

export default {
  namespaced: true,
  state: {
    products: null
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    ADD_PRODUCTS(state, products) {
      state.products = state.products.concat(products)
    },
    UPDATE_PRODUCT_FROM_KITCHEN(state, product) {
      var productIndex = state.products.findIndex(p => p.id === product.id)
      if (productIndex >= 0) {
        for (var prop in product) {
          if (Object.prototype.hasOwnProperty.call(product, prop)) {
            state.products[productIndex][prop] = product[prop]
          }
        }
      }
    },
    REMOVE_PRODUCT_FROM_KITCHEN(state, id) {
      var productIndex = state.products.findIndex(p => p.id === id)
      if (productIndex >= 0) {
        state.products.splice(productIndex, 1)
      }
    }
  },
  actions: {
    fetchProducts({ state, commit }) {
      if (state.products !== null) return
      myKitchenApi.getProductsFromMyKitchen().then(resp => {
        commit('SET_PRODUCTS', resp.data)
      })
    },
    addProducts({ commit }, products) {
      return new Promise((resolve, reject) => {
        myKitchenApi
          .addProductsToMyKitchen(products)
          .then(resp => {
            commit('ADD_PRODUCTS', resp.data)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    editProductFromKitchen({ commit }, { id, product }) {
      return new Promise((resolve, reject) => {
        myKitchenApi
          .updateProductFromMyKitchen(id, product)
          .then(resp => {
            commit('UPDATE_PRODUCT_FROM_KITCHEN', resp.data)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    deleteProductFromKitchen({ commit }, id) {
      return new Promise((resolve, reject) => {
        myKitchenApi
          .removeProductFromMyKitchenById(id)
          .then(() => {
            commit('REMOVE_PRODUCT_FROM_KITCHEN', id)
            resolve()
          })
          .catch(error => reject(error))
      })
    }
  }
}
