import recipeApi from '@/api/recipeApi'

export default {
  namespaced: true,
  state: {
    recipes: null,
    recipesDetails: [],
    favouriteRecipesIds: [],
    availableRecipes: null,
    almostAvailableRecipes: null,
    allAvailableRecipesCount: null,
    allAlmostAvailableRecipesCount: null
  },
  mutations: {
    SET_RECIPES(state, recipes) {
      state.recipes = recipes
    },
    SET_FAVOURITE_RECIPES_IDS(state, recipesIds) {
      state.favouriteRecipesIds = recipesIds
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
    },
    ADD_RECIPE_ID_TO_FAVOURITES(state, recipeId) {
      if (state.favouriteRecipesIds.find(id => id === recipeId)) return
      state.favouriteRecipesIds.push(recipeId)
    },
    REMOVE_RECIPE_ID_FROM_FAVOURITES(state, recipeId) {
      var recipeIdIndex = state.favouriteRecipesIds.indexOf(recipeId)
      if (recipeIdIndex >= 0) {
        state.favouriteRecipesIds.splice(recipeIdIndex, 1)
      }
    }
  },
  actions: {
    fetchRecipes({ commit }) {
      recipeApi.getRecipes().then(resp => {
        commit('SET_RECIPES', resp.data.recipes)
      })
    },
    fetchFavouriteRecipesIds({ commit }) {
      recipeApi.getFavouriteRecipesIds().then(resp => {
        commit('SET_FAVOURITE_RECIPES_IDS', resp.data)
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
            .getRecipeDetails(id)
            .then(resp => {
              commit('ADD_RECIPE_DETAILS', resp.data)
              resolve(resp.data)
            })
            .catch(error => reject(error))
        }
      })
    },
    addToFavourites({ commit }, id) {
      return new Promise((resolve, reject) => {
        recipeApi
          .addRecipeToFavourites(id)
          .then(() => {
            commit('ADD_RECIPE_ID_TO_FAVOURITES', id)
            resolve()
          })
          .catch(error => reject(error))
      })
    },
    deleteFromFavourites({ commit }, id) {
      return new Promise((resolve, reject) => {
        recipeApi
          .removeRecipeFromFavourites(id)
          .then(() => {
            commit('REMOVE_RECIPE_ID_FROM_FAVOURITES', id)
            resolve()
          })
          .catch(error => reject(error))
      })
    }
  },
  getters: {
    getRecipeDetailsById: state => id => {
      return state.recipesDetails.find(r => r.id === id)
    }
  }
}
