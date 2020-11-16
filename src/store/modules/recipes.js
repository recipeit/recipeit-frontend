import recipeApi from '@/api/recipeApi'

export default {
  namespaced: true,
  state: {
    recipes: null,
    recipesDetails: [],
    availableRecipes: null,
    almostAvailableRecipes: null,
    allAvailableRecipesCount: null,
    allAlmostAvailableRecipesCount: null
  },
  mutations: {
    SET_RECIPES(state, recipes) {
      state.recipes = recipes
    },
    SET_AVAILABLE_RECIPES(state, { recipes, allCount }) {
      state.availableRecipes = recipes
      state.allAvailableRecipesCount = allCount
    },
    SET_ALMOST_AVAILABLE_RECIPES(state, { recipes, allCount }) {
      state.almostAvailableRecipes = recipes
      state.allAlmostAvailableRecipesCount = allCount
    },
    SET_RECIPE_DETAILS(state, recipeDetails) {
      state.recipeDetails = recipeDetails
    },
    ADD_RECIPE_DETAILS(state, recipeDetails) {
      state.recipesDetails.push(recipeDetails)
    }
  },
  actions: {
    fetchRecipes({ commit }) {
      recipeApi.getRecipes().then(resp => {
        commit('SET_RECIPES', resp.data)
      })
    },
    fetchAvailableRecipes({ commit }) {
      recipeApi.getAvailableRecipes().then(resp => {
        commit('SET_AVAILABLE_RECIPES', resp.data)
      })
    },
    fetchAlmostAvailableRecipes({ commit }) {
      recipeApi.getAlmostAvailableRecipes().then(resp => {
        commit('SET_ALMOST_AVAILABLE_RECIPES', resp.data)
      })
    },
    fetchRecipeDetails({ getters, commit }, id) {
      return new Promise((resolve, reject) => {
        const recipeDetails = getters.getRecipeDetailsById(id)

        if (recipeDetails) {
          resolve(recipeDetails)
        } else {
          recipeApi
            .getRecipe(id)
            .then(resp => {
              commit('ADD_RECIPE_DETAILS', resp.data)
              resolve(resp.data)
            })
            .catch(error => reject(error))
        }
      })
    }
  },
  getters: {
    getRecipeDetailsById: state => id => {
      return state.recipesDetails.find(r => r.id === id)
    }
  }
}
