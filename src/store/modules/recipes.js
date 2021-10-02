import recipeApi from '@/api/recipeApi'
import userApi from '@/api/userApi'

import { FINISHED_DIRECTIONS_STORAGE_KEY } from '@/configs/storage'

import toastPlugin from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

export const MUTATIONS = {
  SET_FAVOURITE_RECIPES_IDS: 'SET_FAVOURITE_RECIPES_IDS',

  SET_RECIPE_DETAILS: 'SET_RECIPE_DETAILS',
  ADD_RECIPE: 'ADD_RECIPE',
  ADD_DETAILED_RECIPE: 'ADD_DETAILED_RECIPE',
  ADD_RECIPE_ID_TO_FAVOURITES: 'ADD_RECIPE_ID_TO_FAVOURITES',
  REMOVE_RECIPE_ID_FROM_FAVOURITES: 'REMOVE_RECIPE_ID_FROM_FAVOURITES',

  SET_FINISHED_DIRECTIONS_FOR_RECIPE: 'SET_FINISHED_DIRECTIONS_FOR_RECIPE'
}

const storageFinishedDirections = localStorage.getItem(FINISHED_DIRECTIONS_STORAGE_KEY)
const parsedStorageFinishedDirections = storageFinishedDirections ? JSON.parse(storageFinishedDirections) : {}

export default {
  namespaced: true,
  state: {
    detailedRecipes: [],
    favouriteRecipesIds: [],
    recipesFinishedDirections: parsedStorageFinishedDirections
  },
  mutations: {
    [MUTATIONS.SET_FAVOURITE_RECIPES_IDS](state, recipesIds) {
      state.favouriteRecipesIds = recipesIds
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
    },

    [MUTATIONS.SET_FINISHED_DIRECTIONS_FOR_RECIPE](state, { recipeId, finishedDirections }) {
      state.recipesFinishedDirections[recipeId] = finishedDirections
    }
  },
  actions: {
    fetchFavouriteRecipesIds({ commit }) {
      userApi.getFavouriteRecipesIds().then(resp => {
        commit(MUTATIONS.SET_FAVOURITE_RECIPES_IDS, resp.data)
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
        userApi
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
        userApi
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
        userApi
          .addRecipeToPlanned(recipeId, { day, timeOfDay })
          .then(response => {
            resolve(response)
            toastPlugin.toast.show('Przepis zaplanowany!', ToastType.SUCCESS)
          })
          .catch(error => reject(error))
      })
    },

    resetUserData({ commit }) {
      commit(MUTATIONS.SET_FAVOURITE_RECIPES_IDS, [])
    },

    setFinishedDirectionsForRecipe({ commit }, { recipeId, finishedDirections }) {
      commit(MUTATIONS.SET_FINISHED_DIRECTIONS_FOR_RECIPE, { recipeId, finishedDirections })
      const existedLocalStorageItem = localStorage.getItem(FINISHED_DIRECTIONS_STORAGE_KEY)
      const parsedLocalStorage = existedLocalStorageItem ? JSON.parse(existedLocalStorageItem) : {}
      parsedLocalStorage[recipeId] = finishedDirections?.length > 0 ? finishedDirections : undefined
      localStorage.setItem(FINISHED_DIRECTIONS_STORAGE_KEY, JSON.stringify(parsedLocalStorage))
    }
  },
  getters: {
    getDetailedRecipeById: state => id => state.detailedRecipes.find(r => r.id === id),
    getRecipeById: state => id => state.recipes.items?.find(r => r.id === id),
    getFinishedDirectionsForRecipe: state => recipeId => state.recipesFinishedDirections[recipeId]
  }
}
