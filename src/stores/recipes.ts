import { defineStore } from 'pinia'

import recipeApi from '@/api/recipeApi'
import userApi from '@/api/userApi'

import { FINISHED_DIRECTIONS_STORAGE_KEY } from '@/configs/storage'

import toastPlugin from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

const storageFinishedDirections = localStorage.getItem(FINISHED_DIRECTIONS_STORAGE_KEY)
const parsedStorageFinishedDirections = storageFinishedDirections ? JSON.parse(storageFinishedDirections) : {}

export const useRecipesStore = defineStore('recipes', {
  state: () => {
    return {
      detailedRecipes: [],
      favouriteRecipesIds: [],
      recipesFinishedDirections: parsedStorageFinishedDirections
    }
  },

  actions: {
    async fetchFavouriteRecipesIds() {
      const { data } = await userApi.getFavouriteRecipesIds()
      this.favouriteRecipesIds = data
    },

    async fetchDetailedRecipe(id) {
      const recipeDetails = this.getDetailedRecipeById(id)

      if (recipeDetails) {
        return recipeDetails
      } else {
        const { data } = await recipeApi.getDetailedRecipe(id)

        const recipe = { ...data.recipe }
        recipe.details = data.details

        this.detailedRecipes.push(recipe)

        if (this.detailedRecipes.length > 10) {
          this.detailedRecipes.shift()
        }

        return recipe
      }
    },

    async addToFavourites(id) {
      await userApi.addRecipeToFavourites(id)

      if (this.favouriteRecipesIds.find(recipeId => recipeId === id)) {
        return
      }

      this.favouriteRecipesIds.push(id)
    },

    async deleteFromFavourites(id) {
      await userApi.removeRecipeFromFavourites(id)

      const recipeIdIndex = this.favouriteRecipesIds.indexOf(id)

      if (recipeIdIndex >= 0) {
        this.favouriteRecipesIds.splice(recipeIdIndex, 1)
      }
    },

    async addRecipeToPlanned({ recipeId, day, timeOfDay }) {
      const response = await userApi.addRecipeToPlanned(recipeId, { day, timeOfDay })

      toastPlugin.toast.show('Przepis zaplanowany!', ToastType.SUCCESS)

      return response
    },

    resetUserData() {
      this.favouriteRecipesIds = []
    },

    setFinishedDirectionsForRecipe({ recipeId, finishedDirections }) {
      this.recipesFinishedDirections[recipeId] = finishedDirections
      const existedLocalStorageItem = localStorage.getItem(FINISHED_DIRECTIONS_STORAGE_KEY)
      const parsedLocalStorage = existedLocalStorageItem ? JSON.parse(existedLocalStorageItem) : {}
      parsedLocalStorage[recipeId] = finishedDirections?.length > 0 ? finishedDirections : undefined
      localStorage.setItem(FINISHED_DIRECTIONS_STORAGE_KEY, JSON.stringify(parsedLocalStorage))
    }
  },

  getters: {
    getDetailedRecipeById: state => id => state.detailedRecipes.find(r => r.id === id),
    getFinishedDirectionsForRecipe: state => recipeId => state.recipesFinishedDirections[recipeId]
  }
})
