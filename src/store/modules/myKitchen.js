import myKitchenApi from '@/api/myKitchenApi'

export const MUTATIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCTS: 'ADD_PRODUCTS',
  UPDATE_PRODUCT_FROM_KITCHEN: 'UPDATE_PRODUCT_FROM_KITCHEN',
  REMOVE_PRODUCT_FROM_KITCHEN: 'REMOVE_PRODUCT_FROM_KITCHEN'
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
    [MUTATIONS.ADD_PRODUCTS](state, products) {
      state.products = state.products.concat(products)
    },
    [MUTATIONS.UPDATE_PRODUCT_FROM_KITCHEN](state, product) {
      var productIndex = state.products.findIndex(p => p.id === product.id)
      if (productIndex >= 0) {
        for (var prop in product) {
          if (Object.prototype.hasOwnProperty.call(product, prop)) {
            state.products[productIndex][prop] = product[prop]
          }
        }
      }
    },
    [MUTATIONS.REMOVE_PRODUCT_FROM_KITCHEN](state, id) {
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
        commit(MUTATIONS.SET_PRODUCTS, resp.data)
      })
    },
    addProducts({ commit }, products) {
      return new Promise((resolve, reject) => {
        myKitchenApi
          .addProductsToMyKitchen(products)
          .then(resp => {
            commit(MUTATIONS.ADD_PRODUCTS, resp.data)
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
            commit(MUTATIONS.UPDATE_PRODUCT_FROM_KITCHEN, resp.data)
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
            commit(MUTATIONS.REMOVE_PRODUCT_FROM_KITCHEN, id)
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
