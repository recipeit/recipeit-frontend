import recipeApi from '@/api/recipeApi'

const defaultRecipeListValue = () => {
  return {
    fetching: false,
    pagesTo: null,
    items: null,
    totalPages: null,
    totalCount: null,
    hasNext: null
  }
}

export default {
  namespaced: true,
  state: {
    recipes: null,
    recipesDetails: [],
    favouriteRecipesIds: [],
    availableRecipes: defaultRecipeListValue(),
    almostAvailableRecipes: defaultRecipeListValue()
  },
  mutations: {
    SET_RECIPES(state, recipes) {
      state.recipes = recipes
    },
    SET_FAVOURITE_RECIPES_IDS(state, recipesIds) {
      state.favouriteRecipesIds = recipesIds
    },
    RESET_AVAILABLE_RECIPES(state) {
      state.availableRecipes = defaultRecipeListValue()
    },
    RESET_ALMOST_AVAILABLE_RECIPES(state) {
      state.almostAvailableRecipes = defaultRecipeListValue()
    },
    SET_AVAILABLE_RECIPES(state, { recipes, currentPage, totalCount, totalPages, hasNext }) {
      state.availableRecipes.fetching = false
      state.availableRecipes.items = recipes
      state.availableRecipes.pagesTo = currentPage
      state.availableRecipes.totalPages = totalPages
      state.availableRecipes.totalCount = totalCount
      state.availableRecipes.hasNext = hasNext
    },
    SET_ALMOST_AVAILABLE_RECIPES(state, { recipes, currentPage, totalCount, totalPages, hasNext }) {
      state.almostAvailableRecipes.fetching = false
      state.almostAvailableRecipes.items = recipes
      state.almostAvailableRecipes.pagesTo = currentPage
      state.almostAvailableRecipes.totalPages = totalPages
      state.almostAvailableRecipes.totalCount = totalCount
      state.almostAvailableRecipes.hasNext = hasNext
    },
    SET_AVAILABLE_RECIPES_FETCHING_STATUS(state, fetching) {
      state.availableRecipes.fetching = fetching
    },
    SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS(state, fetching) {
      state.almostAvailableRecipes.fetching = fetching
    },
    ADD_AVAILABLE_RECIPES(state, { recipes, currentPage, totalCount, totalPages, hasNext }) {
      if (state.availableRecipes.items !== null) {
        state.availableRecipes.items.push(...recipes)
      } else {
        state.availableRecipes.items = recipes
      }
      state.availableRecipes.fetching = false
      state.availableRecipes.pagesTo = currentPage
      state.availableRecipes.totalPages = totalPages
      state.availableRecipes.totalCount = totalCount
      state.availableRecipes.hasNext = hasNext
    },
    ADD_ALMOST_AVAILABLE_RECIPES(state, { recipes, currentPage, totalCount, totalPages, hasNext }) {
      if (state.almostAvailableRecipes.items !== null) {
        state.almostAvailableRecipes.items.push(...recipes)
      } else {
        state.almostAvailableRecipes.items = recipes
      }
      state.almostAvailableRecipes.fetching = false
      state.almostAvailableRecipes.pagesTo = currentPage
      state.almostAvailableRecipes.totalPages = totalPages
      state.almostAvailableRecipes.totalCount = totalCount
      state.almostAvailableRecipes.hasNext = hasNext
    },
    SET_RECIPE_DETAILS(state, recipeDetails) {
      state.recipeDetails = recipeDetails
    },
    ADD_RECIPE(state, recipe) {
      if (state.recipes) {
        state.recipes.push(recipe)
      } else {
        state.recipes = [recipe]
      }
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

    fetchAvailableRecipes({ commit }, queryParams) {
      commit('RESET_AVAILABLE_RECIPES')
      commit('SET_AVAILABLE_RECIPES_FETCHING_STATUS', true)
      recipeApi.getAvailableRecipes(queryParams).then(resp => {
        commit('SET_AVAILABLE_RECIPES', resp.data)
      })
    },
    fetchAlmostAvailableRecipes({ commit }, queryParams) {
      commit('RESET_ALMOST_AVAILABLE_RECIPES')
      commit('SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS', true)
      recipeApi.getAlmostAvailableRecipes(queryParams).then(resp => {
        commit('SET_ALMOST_AVAILABLE_RECIPES', resp.data)
      })
    },

    fetchNextAvailableRecipes({ state, commit }, queryParams) {
      if (state.availableRecipes.fetching) return
      commit('SET_AVAILABLE_RECIPES_FETCHING_STATUS', true)
      recipeApi
        .getAvailableRecipes({
          ...queryParams,
          pageNumber: state.availableRecipes.pagesTo + 1
        })
        .then(resp => {
          commit('ADD_AVAILABLE_RECIPES', resp.data)
        })
    },
    fetchNextAlmostAvailableRecipes({ state, commit }, queryParams) {
      if (state.almostAvailableRecipes.fetching) return
      commit('SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS', true)
      recipeApi
        .getAlmostAvailableRecipes({
          ...queryParams,
          pageNumber: state.almostAvailableRecipes.pagesTo + 1
        })
        .then(resp => {
          commit('ADD_ALMOST_AVAILABLE_RECIPES', resp.data)
        })
    },

    fetchRecipe({ getters, commit }, id) {
      return new Promise((resolve, reject) => {
        const recipe = getters.getRecipeById(id)

        if (recipe) {
          resolve(recipe)
        } else {
          recipeApi
            .getRecipe(id)
            .then(resp => {
              commit('ADD_RECIPE', resp.data)
              resolve(resp.data)
            })
            .catch(error => reject(error))
        }
      })
    },
    fetchRecipeDetails({ getters, commit }, id) {
      return new Promise((resolve, reject) => {
        const recipeDetails = getters.getRecipeDetailsByRecipeId(id)

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
    getRecipeDetailsByRecipeId: state => id => {
      return state.recipesDetails?.find(r => r.recipeId === id)
    },
    getRecipeById: state => id => {
      return state.recipes?.find(r => r.id === id)
    }
  }
}
