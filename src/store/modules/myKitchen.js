import MyKitchenService from '@/services/MyKitchenService'

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
      MyKitchenService.getProducts().then(resp => {
        commit('SET_PRODUCTS', resp.data)
      })
    }
  }
}
