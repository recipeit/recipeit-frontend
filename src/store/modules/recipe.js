import RecipeService from '@/services/RecipeService'

export default {
  state: {
    recipes: []
  },
  mutations: {
    SET_RECIPES(state, recipes) {
      state.recipes = recipes
    }
  },
  actions: {
    fetchRecipes({ commit }) {
      RecipeService.getRecipes().then(resp => {
        commit('SET_RECIPES', resp.data)
      })
    }
  }
}
