import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import { onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

export default function(apiEndpoint) {
  const recipes = ref(new RecipeList())
  const recipesErrors = ref(null)
  const router = useRouter()
  const route = useRoute()

  const loadNextRecipes = () => {
    const { orderMethod, filters, search } = recipes.value
    fetchNextRecipes(orderMethod, filters, search)
  }

  const reloadRecipes = ({ orderMethod, filters, search }) => {
    fetchRecipes(orderMethod, filters, search)
  }

  const reloadRecipesWithQuery = query => {
    fetchRecipesWithQuery(query)
  }

  const fetchNextRecipes = (orderMethod, filters, search) => {
    if (recipes.value.fetching) return
    recipes.value.fetching = true
    recipesErrors.value = null

    const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

    const query = {
      ...queryParams,
      pageNumber: recipes.value.pagesTo + 1
    }

    apiEndpoint(query)
      .then(({ data }) => {
        recipes.value.addFromApi(data)
      })
      .catch(error => {
        recipes.value.fetching = false
        recipesErrors.value = {
          messageId: 'ERORR',
          from: 'LOAD-NEXT'
        }
        this.$errorHandler.captureError(error, {
          [ERROR_ACTION_TAG_NAME]: 'recipeFilteredPagedList.fetchNextRecipes'
        })
      })
  }

  const fetchRecipes = (orderMethod, filters, search) => {
    if (recipes.value.fetching) return

    const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

    fetchRecipesWithQuery(queryParams)
  }

  const fetchRecipesWithQuery = queryParams => {
    recipes.value = new RecipeList()
    recipes.value.fetching = true
    recipesErrors.value = null

    apiEndpoint(queryParams)
      .then(({ data }) => {
        recipes.value.setFromApi(data)

        const queryParams = fetchRecipesQueryParams(data.orderMethod, data.filters, data.search)
        router.replace({ query: queryParams })
      })
      .catch(error => {
        recipes.value.fetching = false
        recipesErrors.value = {
          messageId: 'ERORR',
          from: 'RELOAD',
          query: queryParams
        }
        this.$errorHandler.captureError(error, {
          [ERROR_ACTION_TAG_NAME]: 'recipeFilteredPagedList.fetchRecipesWithQuery'
        })
      })
  }

  onBeforeMount(() => {
    var { query } = route

    if (query) {
      const queryParams = Object.fromEntries(
        Object.entries(query).filter(([key]) => key === 'search' || key === 'orderMethod' || key.startsWith('filters.'))
      )
      fetchRecipesWithQuery(queryParams)
    } else {
      fetchRecipesWithQuery()
    }
  })

  return {
    loadNextRecipes,
    reloadRecipes,
    reloadRecipesWithQuery,
    recipes,
    recipesErrors
  }
}
