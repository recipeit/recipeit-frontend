import { defineStore } from 'pinia'

import recipeApi from '@/api/recipeApi'
import userApi from '@/api/userApi'

import { FINISHED_DIRECTIONS_STORAGE_KEY } from '@/configs/storage'

import toastPlugin from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import { DateYMDString } from '@/typings/date'
import { RecipeEntity } from '@/typings/entities'
import { DetailedRecipe } from '@/typings/recipe'

type RecipesStoreState = {
  detailedRecipes: Array<DetailedRecipe>
  favouriteRecipesIds: Array<RecipeEntity['id']>
  recipesFinishedDirections: { [key: RecipeEntity['id']]: Array<number> }
}

const storageFinishedDirections = localStorage.getItem(FINISHED_DIRECTIONS_STORAGE_KEY)
const parsedStorageFinishedDirections = storageFinishedDirections ? JSON.parse(storageFinishedDirections) : {}

export const useRecipesStore = defineStore('recipes', {
  state: (): RecipesStoreState => {
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

    async fetchDetailedRecipe(id: RecipeEntity['id']): Promise<DetailedRecipe> {
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

    async addToFavourites(id: RecipeEntity['id']) {
      await userApi.addRecipeToFavourites(id)

      if (this.favouriteRecipesIds.find(recipeId => recipeId === id)) {
        return
      }

      this.favouriteRecipesIds.push(id)
    },

    async deleteFromFavourites(id: RecipeEntity['id']) {
      await userApi.removeRecipeFromFavourites(id)

      const recipeIdIndex = this.favouriteRecipesIds.indexOf(id)

      if (recipeIdIndex >= 0) {
        this.favouriteRecipesIds.splice(recipeIdIndex, 1)
      }
    },

    async addRecipeToPlanned({ recipeId, day, timeOfDay }: { recipeId: RecipeEntity['id']; day: DateYMDString; timeOfDay: string }) {
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
    getDetailedRecipeById: state => (id: RecipeEntity['id']) => state.detailedRecipes.find(r => r.id === id),
    getFinishedDirectionsForRecipe: state => (recipeId: RecipeEntity['id']) => state.recipesFinishedDirections[recipeId]
  }
})
