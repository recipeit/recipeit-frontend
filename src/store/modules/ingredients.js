import ingredientsApi from '@/api/ingredientsApi'

export default {
  namespaced: true,
  state: {
    baseProducts: null
  },
  mutations: {
    SET_BASE_INGREDIENTS(state, baseProducts) {
      state.baseProducts = baseProducts
    }
  },
  actions: {
    fetchBaseProducts({ commit, state }) {
      if (state.baseProducts) return

      ingredientsApi.getAllBaseProducts().then(resp => {
        commit('SET_BASE_INGREDIENTS', resp.data)
      })
    }
  }
}
