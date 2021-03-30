import recipeApi from '@/api/recipeApi'
import { RecipeList } from '@/constants'

export const MUTATIONS = {
  SET_FAVOURITE_RECIPES_IDS: 'SET_FAVOURITE_RECIPES_IDS',

  RESET_RECIPES: 'RESET_RECIPES',
  RESET_AVAILABLE_RECIPES: 'RESET_AVAILABLE_RECIPES',
  RESET_ALMOST_AVAILABLE_RECIPES: 'RESET_ALMOST_AVAILABLE_RECIPES',

  SET_RECIPES: 'SET_RECIPES',
  SET_AVAILABLE_RECIPES: 'SET_AVAILABLE_RECIPES',
  SET_ALMOST_AVAILABLE_RECIPES: 'SET_ALMOST_AVAILABLE_RECIPES',

  SET_RECIPES_FETCHING_STATUS: 'SET_RECIPES_FETCHING_STATUS',
  SET_AVAILABLE_RECIPES_FETCHING_STATUS: 'SET_AVAILABLE_RECIPES_FETCHING_STATUS',
  SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS: 'SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS',

  ADD_RECIPES: 'ADD_RECIPES',
  ADD_AVAILABLE_RECIPES: 'ADD_AVAILABLE_RECIPES',
  ADD_ALMOST_AVAILABLE_RECIPES: 'ADD_ALMOST_AVAILABLE_RECIPES',

  SET_RECIPE_DETAILS: 'SET_RECIPE_DETAILS',
  ADD_RECIPE: 'ADD_RECIPE',
  ADD_DETAILED_RECIPE: 'ADD_DETAILED_RECIPE',
  ADD_RECIPE_ID_TO_FAVOURITES: 'ADD_RECIPE_ID_TO_FAVOURITES',
  REMOVE_RECIPE_ID_FROM_FAVOURITES: 'REMOVE_RECIPE_ID_FROM_FAVOURITES'
}

export default {
  namespaced: true,
  state: {
    recipes: new RecipeList(),
    detailedRecipes: [],
    favouriteRecipesIds: [],
    availableRecipes: new RecipeList(),
    almostAvailableRecipes: new RecipeList()
  },
  mutations: {
    [MUTATIONS.SET_FAVOURITE_RECIPES_IDS](state, recipesIds) {
      state.favouriteRecipesIds = recipesIds
    },

    [MUTATIONS.RESET_RECIPES](state) {
      state.recipes = new RecipeList()
    },
    [MUTATIONS.RESET_AVAILABLE_RECIPES](state) {
      state.availableRecipes = new RecipeList()
    },
    [MUTATIONS.RESET_ALMOST_AVAILABLE_RECIPES](state) {
      state.almostAvailableRecipes = new RecipeList()
    },

    [MUTATIONS.SET_RECIPES](state, recipes) {
      state.recipes.setFromApi({ ...recipes, fetching: false })
    },
    [MUTATIONS.SET_AVAILABLE_RECIPES](state, recipes) {
      state.availableRecipes.setFromApi({ ...recipes, fetching: false })
    },
    [MUTATIONS.SET_ALMOST_AVAILABLE_RECIPES](state, recipes) {
      state.almostAvailableRecipes.setFromApi({ ...recipes, fetching: false })
    },

    [MUTATIONS.SET_RECIPES_FETCHING_STATUS](state, fetching) {
      state.recipes.fetching = fetching
    },
    [MUTATIONS.SET_AVAILABLE_RECIPES_FETCHING_STATUS](state, fetching) {
      state.availableRecipes.fetching = fetching
    },
    [MUTATIONS.SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS](state, fetching) {
      state.almostAvailableRecipes.fetching = fetching
    },

    [MUTATIONS.ADD_RECIPES](state, recipes) {
      state.recipes.addFromApi(recipes)
    },
    [MUTATIONS.ADD_AVAILABLE_RECIPES](state, recipes) {
      state.availableRecipes.addFromApi(recipes)
    },
    [MUTATIONS.ADD_ALMOST_AVAILABLE_RECIPES](state, recipes) {
      state.almostAvailableRecipes.addFromApi(recipes)
    },

    [MUTATIONS.SET_RECIPE_DETAILS](state, recipeDetails) {
      state.recipeDetails = recipeDetails
    },
    [MUTATIONS.ADD_RECIPE](state, recipe) {
      if (state.recipes) {
        state.recipes.push(recipe)
      } else {
        state.recipes = [recipe]
      }
    },
    [MUTATIONS.ADD_DETAILED_RECIPE](state, recipe) {
      state.detailedRecipes.push(recipe)

      if (state.detailedRecipes.length > 10) {
        state.detailedRecipes.shift()
      }
    },
    [MUTATIONS.ADD_RECIPE_ID_TO_FAVOURITES](state, recipeId) {
      if (state.favouriteRecipesIds.find(id => id === recipeId)) return
      state.favouriteRecipesIds.push(recipeId)
    },
    [MUTATIONS.REMOVE_RECIPE_ID_FROM_FAVOURITES](state, recipeId) {
      var recipeIdIndex = state.favouriteRecipesIds.indexOf(recipeId)
      if (recipeIdIndex >= 0) {
        state.favouriteRecipesIds.splice(recipeIdIndex, 1)
      }
    }
  },
  actions: {
    fetchFavouriteRecipesIds({ commit }) {
      recipeApi.getFavouriteRecipesIds().then(resp => {
        commit(MUTATIONS.SET_FAVOURITE_RECIPES_IDS, resp.data)
      })
    },

    fetchRecipes({ commit }, queryParams) {
      commit(MUTATIONS.RESET_RECIPES)
      commit(MUTATIONS.SET_RECIPES_FETCHING_STATUS, true)
      recipeApi.getRecipes(queryParams).then(resp => {
        commit(MUTATIONS.SET_RECIPES, resp.data)
      })
    },
    fetchAvailableRecipes({ commit }, queryParams) {
      commit(MUTATIONS.RESET_AVAILABLE_RECIPES)
      commit(MUTATIONS.SET_AVAILABLE_RECIPES_FETCHING_STATUS, true)
      recipeApi.getAvailableRecipes(queryParams).then(resp => {
        commit(MUTATIONS.SET_AVAILABLE_RECIPES, resp.data)
      })
    },
    fetchAlmostAvailableRecipes({ commit }, queryParams) {
      commit(MUTATIONS.RESET_ALMOST_AVAILABLE_RECIPES)
      commit(MUTATIONS.SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS, true)
      recipeApi.getAlmostAvailableRecipes(queryParams).then(resp => {
        commit(MUTATIONS.SET_ALMOST_AVAILABLE_RECIPES, resp.data)
      })
    },

    fetchNextRecipes({ state, commit }, queryParams) {
      if (state.recipes.fetching) return
      commit(MUTATIONS.SET_RECIPES_FETCHING_STATUS, true)
      recipeApi
        .getRecipes({
          ...queryParams,
          pageNumber: state.recipes.pagesTo + 1
        })
        .then(resp => {
          commit(MUTATIONS.ADD_RECIPES, resp.data)
        })
    },
    fetchNextAvailableRecipes({ state, commit }, queryParams) {
      if (state.availableRecipes.fetching) return
      commit(MUTATIONS.SET_AVAILABLE_RECIPES_FETCHING_STATUS, true)
      recipeApi
        .getAvailableRecipes({
          ...queryParams,
          pageNumber: state.availableRecipes.pagesTo + 1
        })
        .then(resp => {
          commit(MUTATIONS.ADD_AVAILABLE_RECIPES, resp.data)
        })
    },
    fetchNextAlmostAvailableRecipes({ state, commit }, queryParams) {
      if (state.almostAvailableRecipes.fetching) return
      commit(MUTATIONS.SET_ALMOST_AVAILABLE_RECIPES_FETCHING_STATUS, true)
      recipeApi
        .getAlmostAvailableRecipes({
          ...queryParams,
          pageNumber: state.almostAvailableRecipes.pagesTo + 1
        })
        .then(resp => {
          commit(MUTATIONS.ADD_ALMOST_AVAILABLE_RECIPES, resp.data)
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
    fetchDetailedRecipe({ getters, commit }, id) {
      return new Promise((resolve, reject) => {
        const recipeDetails = getters.getDetailedRecipeById(id)

        if (recipeDetails) {
          resolve(recipeDetails)
        } else {
          recipeApi
            .getDetailedRecipe(id)
            .then(resp => {
              let recipe = resp.data.recipe
              recipe.details = resp.data.details
              commit(MUTATIONS.ADD_DETAILED_RECIPE, recipe)
              resolve(recipe)
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
            commit(MUTATIONS.ADD_RECIPE_ID_TO_FAVOURITES, id)
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
            commit(MUTATIONS.REMOVE_RECIPE_ID_FROM_FAVOURITES, id)
            resolve()
          })
          .catch(error => reject(error))
      })
    },

    addRecipeToPlanned(_, { recipeId, day, timeOfDay }) {
      return new Promise((resolve, reject) => {
        recipeApi
          .addRecipeToPlanned(recipeId, { day, timeOfDay })
          .then(response => {
            console.log(response)
            // commit(MUTATIONS.ADD_RECIPE_ID_TO_FAVOURITES, id)
            resolve(response)
          })
          .catch(error => reject(error))
      })
    },

    resetUserData({ commit }) {
      commit(MUTATIONS.SET_FAVOURITE_RECIPES_IDS, [])
      commit(MUTATIONS.RESET_ALMOST_AVAILABLE_RECIPES)
      commit(MUTATIONS.RESET_AVAILABLE_RECIPES)
      commit(MUTATIONS.RESET_RECIPES)
    }
  },
  getters: {
    getDetailedRecipeById: state => id => {
      return state.detailedRecipes.find(r => r.id === id)
    },
    getRecipeById: state => id => {
      return state.recipes.items?.find(r => r.id === id)
    }
  }
}
