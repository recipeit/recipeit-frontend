import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import { onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

export default function(apiEndpoint) {
  const recipes = ref(new RecipeList())
  const initialQueryParams = ref(null)
  const recipesErrors = ref(null)
  const router = useRouter()
  const route = useRoute()

  // const loadNextRecipes = () => {
  //   const { orderMethod, filters, search } = recipes.value
  //   fetchNextRecipes(orderMethod, filters, search)
  // }

  const loadRecipesPage = async page => {
    if (Object.keys(recipes.value.pagedItems)?.length > 0 || !initialQueryParams.value) {
      const { orderMethod, filters, search } = recipes.value
      return await fetchRecipesPage(orderMethod, filters, search, page)
    } else {
      return await fetchRecipesPageWithQuery(initialQueryParams.value, page)
    }
  }

  const reloadRecipes = ({ orderMethod, filters, search } = {}) => {
    // console.log('reload')
    recipes.value.orderMethod = orderMethod || null
    recipes.value.filters = filters || {}
    recipes.value.search = search || null
    recipes.value.totalCount = null
    recipes.value.pagedItems = {}
    // fetchRecipes(orderMethod, filters, search)
  }

  const reloadRecipesWithQuery = query => {
    // console.log(query)
    initialQueryParams.value = query
    reloadRecipes()
    // fetchRecipesWithQuery(query)
  }

  // const fetchNextRecipes = (orderMethod, filters, search) => {
  //   if (recipes.value.fetching) return
  //   recipes.value.fetching = true
  //   recipesErrors.value = null

  //   const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

  //   const query = {
  //     ...queryParams,
  //     pageNumber: recipes.value.pagesTo + 1
  //   }

  //   apiEndpoint(query)
  //     .then(({ data }) => {
  //       recipes.value.addFromApi(data)
  //     })
  //     .catch(error => {
  //       recipes.value.fetching = false
  //       recipesErrors.value = {
  //         messageId: 'ERORR',
  //         from: 'LOAD-NEXT'
  //       }
  //       this.$errorHandler.captureError(error, {
  //         [ERROR_ACTION_TAG_NAME]: 'recipeFilteredPagedList.fetchNextRecipes'
  //       })
  //     })
  // }

  const fetchRecipesPage = async (orderMethod, filters, search, page) => {
    recipes.value.fetchingPages[page] = true
    recipesErrors.value = null

    const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

    const query = {
      ...queryParams,
      pageNumber: page
    }

    try {
      const { data } = await apiEndpoint(query)
      recipes.value.addFromApi(data)
      delete recipes.value.fetchingPages[page]
      router.replace({ query: queryParams })
    } catch (error) {
      recipesErrors.value = {
        messageId: 'ERORR',
        from: 'LOAD'
      }
      this.$errorHandler.captureError(error, {
        [ERROR_ACTION_TAG_NAME]: 'recipeFilteredPagedList.fetchRecipesPage'
      })

      delete recipes.value.fetchingPages[page]
      return new Error(error)
    }

    return true
  }

  const fetchRecipesPageWithQuery = async (queryParams, page) => {
    recipes.value.fetchingPages[page] = true
    recipesErrors.value = null

    const query = {
      ...queryParams,
      pageNumber: page
    }

    try {
      const { data } = await apiEndpoint(query)
      recipes.value.addFromApi(data)
      delete recipes.value.fetchingPages[page]
      router.replace({ query: queryParams })
      initialQueryParams.value = null
    } catch (error) {
      recipesErrors.value = {
        messageId: 'ERORR',
        from: 'LOAD'
      }
      this.$errorHandler.captureError(error, {
        [ERROR_ACTION_TAG_NAME]: 'recipeFilteredPagedList.fetchRecipesPage'
      })

      delete recipes.value.fetchingPages[page]
      return new Error(error)
    }

    return true
  }

  // const fetchRecipesWithQuery = queryParams => {
  //   recipes.value = new RecipeList()
  //   recipes.value.fetching = true
  //   recipesErrors.value = null

  //   apiEndpoint(queryParams)
  //     .then(({ data }) => {
  //       recipes.value.setFromApi(data)

  //       const queryParams = fetchRecipesQueryParams(data.orderMethod, data.filters, data.search)
  //       router.replace({ query: queryParams })
  //     })
  //     .catch(error => {
  //       recipes.value.fetching = false
  //       recipesErrors.value = {
  //         messageId: 'ERORR',
  //         from: 'RELOAD',
  //         query: queryParams
  //       }
  //       this.$errorHandler.captureError(error, {
  //         [ERROR_ACTION_TAG_NAME]: 'recipeFilteredPagedList.fetchRecipesWithQuery'
  //       })
  //     })
  // }

  onBeforeMount(() => {
    var { query } = route

    if (query) {
      initialQueryParams.value = Object.fromEntries(
        Object.entries(query).filter(([key]) => key === 'search' || key === 'orderMethod' || key.startsWith('filters.'))
      )
    }
  })

  return {
    loadRecipesPage,
    // loadNextRecipes,
    reloadRecipes,
    reloadRecipesWithQuery,
    recipes,
    recipesErrors
  }
}
