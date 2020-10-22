import ShoppingListService from '@/services/ShoppingListService'

export default {
  namespaced: true,
  state: {
    products: []
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    }
  },
  actions: {
    fetchProducts({ commit }) {
      ShoppingListService.getProducts().then(resp => {
        commit('SET_PRODUCTS', resp.data)
      })
    }
  }
}
