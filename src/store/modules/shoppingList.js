import shoppingListApi from '@/api/shoppingListApi'

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
      shoppingListApi.getProducts().then(resp => {
        commit('SET_PRODUCTS', resp.data)
      })
    }
  }
}
