import ingredientsApi from '@/api/ingredientsApi'

export const MUTATIONS = {
  SET_BASE_INGREDIENTS: 'SET_BASE_INGREDIENTS'
}

export default {
  namespaced: true,
  state: {
    baseProducts: null
  },
  mutations: {
    [MUTATIONS.SET_BASE_INGREDIENTS](state, baseProducts) {
      state.baseProducts = baseProducts
    }
  },
  actions: {
    fetchBaseProducts({ commit, state }) {
      if (state.baseProducts) return

      ingredientsApi.getAllBaseProducts().then(resp => {
        commit(MUTATIONS.SET_BASE_INGREDIENTS, resp.data)
      })
    }
  }
}
