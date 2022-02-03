import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import recipeApi from '@/api/recipeApi'
import userApi from '@/api/userApi'

import { FINISHED_DIRECTIONS_STORAGE_KEY } from '@/configs/storage'

import toastPlugin from '@/plugins/toast'

import { DateYMDString } from '@/typings/dates'
import { RecipeEntity } from '@/typings/entities'
import { DetailedRecipe } from '@/typings/recipes'

type RecipesStoreState = {
  detailedRecipes: Array<DetailedRecipe>
  favouriteRecipesIds: Array<RecipeEntity['id']>
  recipesFinishedDirections: { [key: RecipeEntity['id']]: Array<number> }
}

export const useRecipesStore = defineStore('recipes', () => {
  const storageFinishedDirections = localStorage.getItem(FINISHED_DIRECTIONS_STORAGE_KEY)
  const parsedStorageFinishedDirections = storageFinishedDirections ? JSON.parse(storageFinishedDirections) : {}

  // state
  const state = reactive<RecipesStoreState>({
    detailedRecipes: [],
    favouriteRecipesIds: [],
    recipesFinishedDirections: parsedStorageFinishedDirections
  })

  // internal methods
  const getDetailedRecipeById = (id: RecipeEntity['id']) => {
    return state.detailedRecipes.find(r => r.id === id)
  }

  // actions
  const fetchFavouriteRecipesIds = async () => {
    const { data } = await userApi.getFavouriteRecipesIds()
    state.favouriteRecipesIds = data
  }

  const fetchDetailedRecipe = async (id: RecipeEntity['id']) => {
    const recipeDetails = getDetailedRecipeById(id)

    if (recipeDetails) {
      return recipeDetails
    } else {
      const { data } = await recipeApi.getDetailedRecipe(id)

      const recipe: DetailedRecipe = { ...data.recipe, details: data.details }

      state.detailedRecipes.push(recipe)

      if (state.detailedRecipes.length > 10) {
        state.detailedRecipes.shift()
      }

      return recipe
    }
  }

  const addToFavourites = async (id: RecipeEntity['id']) => {
    await userApi.addRecipeToFavourites(id)

    if (state.favouriteRecipesIds.find(recipeId => recipeId === id)) {
      return
    }

    state.favouriteRecipesIds.push(id)
  }

  const deleteFromFavourites = async (id: RecipeEntity['id']) => {
    await userApi.removeRecipeFromFavourites(id)

    const recipeIdIndex = state.favouriteRecipesIds.indexOf(id)

    if (recipeIdIndex >= 0) {
      state.favouriteRecipesIds.splice(recipeIdIndex, 1)
    }
  }

  const addRecipeToPlanned = async ({
    recipeId,
    day,
    timeOfDay
  }: {
    recipeId: RecipeEntity['id']
    day: DateYMDString
    timeOfDay: string
  }) => {
    const response = await userApi.addRecipeToPlanned(recipeId, { day, timeOfDay })

    toastPlugin.toast.show('Przepis zaplanowany!', 'success')

    return response
  }

  const resetUserData = () => {
    state.favouriteRecipesIds = []
  }

  const setFinishedDirectionsForRecipe = ({ recipeId, finishedDirections }) => {
    state.recipesFinishedDirections[recipeId] = finishedDirections
    const existedLocalStorageItem = localStorage.getItem(FINISHED_DIRECTIONS_STORAGE_KEY)
    const parsedLocalStorage = existedLocalStorageItem ? JSON.parse(existedLocalStorageItem) : {}
    parsedLocalStorage[recipeId] = finishedDirections?.length > 0 ? finishedDirections : undefined
    localStorage.setItem(FINISHED_DIRECTIONS_STORAGE_KEY, JSON.stringify(parsedLocalStorage))
  }

  // getter methods
  const getFinishedDirectionsForRecipe = (recipeId: RecipeEntity['id']) => {
    return state.recipesFinishedDirections[recipeId]
  }

  return {
    // state
    ...toRefs(state),
    // actions
    fetchFavouriteRecipesIds,
    fetchDetailedRecipe,
    addToFavourites,
    deleteFromFavourites,
    addRecipeToPlanned,
    resetUserData,
    setFinishedDirectionsForRecipe,
    // getter methods
    getFinishedDirectionsForRecipe
  }
})
