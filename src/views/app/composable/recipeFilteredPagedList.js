import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { fetchRecipesQueryParams, queryParamsFromRouteQuery, RecipeList } from '@/constants'
import { onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import { useErrorHandler } from '@/error'

export default apiEndpoint => {
  const recipes = ref(new RecipeList())
  const initialQueryParams = ref(null)
  const recipesErrors = ref(null)
  const router = useRouter()
  const route = useRoute()
  const errorHandler = useErrorHandler()

  const loadRecipesPage = async (page, updateRoute = true) => {
    const { orderMethod, filters, search, pagedItems } = recipes.value
    if (Object.keys(pagedItems)?.length > 0) {
      return await fetchRecipesPage(orderMethod, filters, search, page)
    } else if (!initialQueryParams.value) {
      return await fetchRecipesPage(orderMethod, filters, search, page, updateRoute)
    } else {
      return await fetchRecipesPageWithQuery(initialQueryParams.value, page, updateRoute)
    }
  }

  const reloadRecipes = ({ orderMethod, filters, search } = {}) => {
    recipes.value = new RecipeList(orderMethod, filters, search)
  }

  const reloadRecipesWithQuery = query => {
    initialQueryParams.value = query
    reloadRecipes()
  }

  const fetchRecipesPage = async (orderMethod, filters, search, pageNumber, updateRoute) => {
    const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)
    return await fetchRecipesPageWithQuery(queryParams, pageNumber, updateRoute)
  }

  const fetchRecipesPageWithQuery = async (queryParams, pageNumber, updateRoute) => {
    recipes.value.fetchingPages[pageNumber] = true
    recipesErrors.value = null

    const query = {
      ...queryParams,
      pageNumber
    }

    try {
      const { data } = await apiEndpoint(query)
      recipes.value.addFromApi(data)
      delete recipes.value.fetchingPages[pageNumber]
      initialQueryParams.value = null
      if (updateRoute) {
        router.replace({ query: queryParams })
      }
    } catch (error) {
      recipesErrors.value = {
        messageId: 'ERORR',
        from: 'LOAD'
      }
      errorHandler.captureError(error, {
        [ERROR_ACTION_TAG_NAME]: 'recipeFilteredPagedList.fetchRecipesPage'
      })

      delete recipes.value.fetchingPages[pageNumber]
      return new Error(error)
    }

    return true
  }

  onBeforeMount(() => {
    initialQueryParams.value = queryParamsFromRouteQuery(route.query)
  })

  return {
    loadRecipesPage,
    reloadRecipes,
    reloadRecipesWithQuery,
    recipes,
    recipesErrors
  }
}
