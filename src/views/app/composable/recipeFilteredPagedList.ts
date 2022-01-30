import { onBeforeMount, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

import {
  fetchRecipesQueryParams,
  queryParamsFromRouteQuery,
  RecipeList,
  RecipePageFilters,
  RecipePageParams,
  RecipePageQueryParams
} from '@/constants'

import { useErrorHandler } from '@/error'

export default apiEndpoint => {
  const recipes = ref(new RecipeList())
  const initialQueryParams: Ref<RecipePageQueryParams> = ref(null)
  const recipesErrors = ref(null)
  const router = useRouter()
  const route = useRoute()
  const errorHandler = useErrorHandler()

  const loadRecipesPage = async (page: number, updateRoute = true) => {
    const { orderMethod, filters, search, pagedItems } = recipes.value
    if (Object.keys(pagedItems)?.length > 0) {
      return await fetchRecipesPage(orderMethod, filters, search, page)
    } else if (!initialQueryParams.value) {
      return await fetchRecipesPage(orderMethod, filters, search, page, updateRoute)
    } else {
      return await fetchRecipesPageWithQuery(initialQueryParams.value, page, updateRoute)
    }
  }

  const reloadRecipes = ({ orderMethod, filters, search }: RecipePageParams = {}) => {
    recipes.value = new RecipeList(orderMethod, filters, search)
  }

  const reloadRecipesWithQuery = (query: RecipePageQueryParams) => {
    initialQueryParams.value = query
    reloadRecipes()
  }

  const fetchRecipesPage = async (
    orderMethod?: string,
    filters?: RecipePageFilters,
    search?: string,
    pageNumber?: number,
    updateRoute?: boolean
  ) => {
    const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)
    return await fetchRecipesPageWithQuery(queryParams, pageNumber, updateRoute)
  }

  const fetchRecipesPageWithQuery = async (queryParams?: RecipePageQueryParams, pageNumber?: number, updateRoute?: boolean) => {
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
