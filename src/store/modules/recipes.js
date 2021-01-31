import recipeApi from '@/api/recipeApi'
import { RecipeList } from '@/constants'

export default {
  namespaced: true,
  state: {
    recipes: new RecipeList(),
    recipesDetails: [],
    favouriteRecipesIds: [],
    availableRecipes: new RecipeList(),
    almostAvailableRecipes: new RecipeList(),
    filterOptions: null
  },
  mutations: {
    SET_FAVOURITE_RECIPES_IDS(state, recipesIds) {
      state.favouriteRecipesIds = recipesIds
    },

    RESET_RECIPES(state) {
      state.recipes = new RecipeList()
    },
    RESET_AVAILABLE_RECIPES(state) {
      state.availableRecipes = new RecipeList()
    },
    RESET_ALMOST_AVAILABLE_RECIPES(state) {
      state.almostAvailableRecipes = new RecipeList()
    },

    SET_RECIPES(state, recipes) {
      state.recipes.setFromApi({ ...recipes, fetching: false })
    },
    SET_AVAILABLE_RECIPES(state, recipes) {
      state.availableRecipes.setFromApi({ ...recipes, fetching: false })
    },
    SET_ALMOST_AVAILABLE_RECIPES(state, recipes) {
      state.almostAvailableRecipes.setFromApi({ ...recipes, fetching: false })
    },

    SET_RECIPES_FETCHING_STATUS(state, fetching) {
      state.recipes.fetching = fetching
    },
    SET_AVAILABLE_RECIPES_FETCHING_STATUS(state, fetching) {
      state.availableRecipes.fetching = fetching
    },
    SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS(state, fetching) {
      state.almostAvailableRecipes.fetching = fetching
    },

    ADD_RECIPES(state, recipes) {
      state.recipes.addFromApi(recipes)
    },
    ADD_AVAILABLE_RECIPES(state, recipes) {
      state.availableRecipes.addFromApi(recipes)
    },
    ADD_ALMOST_AVAILABLE_RECIPES(state, recipes) {
      state.almostAvailableRecipes.addFromApi(recipes)
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
    },

    SET_FILTER_OPTIONS(state, filterOptions) {
      state.filterOptions = filterOptions
    }
  },
  actions: {
    fetchFavouriteRecipesIds({ commit }) {
      recipeApi.getFavouriteRecipesIds().then(resp => {
        commit('SET_FAVOURITE_RECIPES_IDS', resp.data)
      })
    },

    fetchRecipes({ commit }, queryParams) {
      commit('RESET_RECIPES')
      commit('SET_RECIPES_FETCHING_STATUS', true)
      recipeApi.getRecipes(queryParams).then(resp => {
        commit('SET_RECIPES', resp.data)
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

    fetchNextRecipes({ state, commit }, queryParams) {
      if (state.recipes.fetching) return
      commit('SET_RECIPES_FETCHING_STATUS', true)
      recipeApi
        .getRecipes({
          ...queryParams,
          pageNumber: state.recipes.pagesTo + 1
        })
        .then(resp => {
          commit('ADD_RECIPES', resp.data)
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
    },

    fetchRecipeFilterOptions({ getters, commit }, id) {
      return new Promise((resolve, reject) => {
        const options = getters.getRecipeFilterOptions()

        if (options) {
          resolve(options)
        } else {
          recipeApi
            .getRecipeFilterOptions(id)
            .then(resp => {
              commit('SET_FILTER_OPTIONS', resp.data)
              resolve(resp.data)
            })
            .catch(error => reject(error))
        }
      })
    }
  },
  getters: {
    getRecipeDetailsByRecipeId: state => id => {
      return state.recipesDetails?.find(r => r.recipeId === id)
    },
    getRecipeById: state => id => {
      return state.recipes.items?.find(r => r.id === id)
    },
    getRecipeFilterOptions: state => () => {
      return state.filterOptions
    }
  }
}
