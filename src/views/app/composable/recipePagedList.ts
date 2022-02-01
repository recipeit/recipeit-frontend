import { AxiosResponse } from 'axios'
import { ref } from 'vue'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

import { useErrorHandler } from '@/error'

import { RecipesPageState } from '@/models/RecipesPageState'

import { RecipesPage } from '@/typings/recipesPage'

export default (apiEndpoint: (query?: unknown) => Promise<AxiosResponse<RecipesPage>>) => {
  const recipes = ref(new RecipesPageState())
  const recipesErrors = ref(null)
  const errorHandler = useErrorHandler()

  const loadRecipesPage = async (pageNumber: number) => {
    return await fetchRecipesPage(pageNumber)
  }

  const reloadRecipes = () => {
    recipes.value = new RecipesPageState()
  }

  const fetchRecipesPage = async (pageNumber: number) => {
    recipes.value.fetchingPages[pageNumber] = true
    recipesErrors.value = null

    const query = {
      pageNumber
    }

    try {
      const { data } = await apiEndpoint(query)

      recipes.value.addFromApi(data)

      delete recipes.value.fetchingPages[pageNumber]
    } catch (error) {
      recipesErrors.value = {
        messageId: 'ERORR',
        from: 'LOAD'
      }

      errorHandler.captureError(error, {
        [ERROR_ACTION_TAG_NAME]: 'recipePagedList.fetchRecipesPage'
      })

      delete recipes.value.fetchingPages[pageNumber]

      return new Error(error)
    }

    return true
  }

  return {
    loadRecipesPage,
    reloadRecipes,
    recipes,
    recipesErrors
  }
}
