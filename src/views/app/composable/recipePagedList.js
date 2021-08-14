import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { RecipeList } from '@/constants'
import { ref } from '@vue/runtime-core'
import { useErrorHandler } from '@/error'

export default function(apiEndpoint) {
  const recipes = ref(new RecipeList())
  const recipesErrors = ref(null)
  const errorHandler = useErrorHandler()

  const loadRecipesPage = async page => {
    return await fetchRecipesPage(page)
  }

  const reloadRecipes = () => {
    recipes.value = new RecipeList()
  }

  const fetchRecipesPage = async pageNumber => {
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
