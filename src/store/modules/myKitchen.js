import MyKitchenService from '@/services/MyKitchenService'

export default {
  namespaced: true,
  state: {
    products: [
      {
        id: 1,
        name: 'cebula',
        quantity: '2 sztuki'
      },
      {
        id: 2,
        name: 'papryka',
        quantity: '3 sztuki'
      },
      {
        id: 3,
        name: 'czosnek',
        quantity: '1 ząbek'
      },
      {
        id: 4,
        name: 'czosnek',
        quantity: '1 ząbek'
      }
    ]
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
