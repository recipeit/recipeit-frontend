import ingredientsApi from '@/api/ingredientsApi'

export default {
  namespaced: true,
  state: {
    baseIngredients: null
  },
  mutations: {
    SET_BASE_INGREDIENTS(state, baseIngredients) {
      state.baseIngredients = baseIngredients
    }
  },
  actions: {
    fetchBaseIngredients({ commit }) {
      // if (state.baseIngredients) return

      ingredientsApi.getAllBaseIngredients().then(resp => {
        commit('SET_BASE_INGREDIENTS', resp.data)
      })
    }
  }
}
