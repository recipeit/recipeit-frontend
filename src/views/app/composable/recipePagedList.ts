import { ref } from 'vue'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

import { RecipeList } from '@/constants'

import { useErrorHandler } from '@/error'

export default apiEndpoint => {
  const recipes = ref(new RecipeList())
  const recipesErrors = ref(null)
  const errorHandler = useErrorHandler()

  const loadRecipesPage = async (pageNumber: number) => {
    return await fetchRecipesPage(pageNumber)
  }

  const reloadRecipes = () => {
    recipes.value = new RecipeList()
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
