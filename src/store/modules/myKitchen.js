import myKitchenApi from '@/api/myKitchenApi'

export const MUTATIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCTS: 'ADD_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
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
      var newProductsIds = products.map(({ id }) => id)
      var currentProductsWithoutUpdated = state.products.filter(({ id }) => !newProductsIds.includes(id))
      state.products = currentProductsWithoutUpdated.concat(products)
    },
    [MUTATIONS.ADD_PRODUCT](state, product) {
      var existingIndex = state.products.findIndex(({ id }) => id === product.id)

      if (existingIndex >= 0) {
        state.products[existingIndex] = product
      } else {
        state.products.push(product)
      }
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
    addProduct({ commit }, { product, expirationDates }) {
      return new Promise((resolve, reject) => {
        myKitchenApi
          .addProductToMyKitchen(product, expirationDates)
          .then(resp => {
            commit(MUTATIONS.ADD_PRODUCTS, resp.data)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    editProductFromKitchen({ commit }, { id, product, expirationDates }) {
      return new Promise((resolve, reject) => {
        myKitchenApi
          .updateProductFromMyKitchen(id, product, expirationDates)
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
    includeProductToList({ commit }, product) {
      commit(MUTATIONS.ADD_PRODUCT, product)
    },
    includeProductsToList({ commit }, products) {
      commit(MUTATIONS.ADD_PRODUCTS, products)
    },
    resetUserData({ commit }) {
      commit(MUTATIONS.SET_PRODUCTS, null)
    }
  }
}
