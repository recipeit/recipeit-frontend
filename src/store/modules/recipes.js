import RecipeService from '@/services/RecipeService'

export default {
  namespaced: true,
  state: {
    recipes: [
      {
        id: 0,
        name: 'Makaron zapiekany z kurczakiem i szpinak...',
        rating: 4.3
      },
      {
        id: 1,
        name: 'Kurczak po chińsku',
        rating: 4.3
      },
      {
        id: 2,
        name: 'Spaghetti po bolońsku',
        rating: 4.5
      },
      {
        id: 2,
        name: 'Spaghetti po bolońsku',
        rating: 4.5
      }
    ]
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
