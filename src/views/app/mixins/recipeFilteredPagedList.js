import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import { onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

export default function(apiEndpoint) {
  const recipes = ref(new RecipeList())
  const router = useRouter()
  const route = useRoute()

  const loadNextRecipes = () => {
    const { orderMethod, filters, search } = recipes.value
    fetchNextRecipes(orderMethod, filters, search)
  }

  const reloadRecipes = ({ orderMethod, filters, search }) => {
    fetchRecipes(orderMethod, filters, search)
  }

  const fetchNextRecipes = (orderMethod, filters, search) => {
    if (recipes.value.fetching) return
    recipes.value.fetching = true

    const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

    apiEndpoint({
      ...queryParams,
      pageNumber: recipes.value.pagesTo + 1
    }).then(({ data }) => {
      recipes.value.addFromApi(data)
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

    apiEndpoint(queryParams).then(({ data }) => {
      recipes.value.setFromApi(data)

      const queryParams = fetchRecipesQueryParams(data.orderMethod, data.filters, data.search)
      router.replace({ query: queryParams })
    })
  }

  onBeforeMount(() => {
    var { query } = route

    if (query) {
      const queryParams = Object.fromEntries(
        Object.keys(query)
          .filter(key => key === 'search' || key === 'orderMethod' || key.startsWith('filters.'))
          .map(key => [key, query[key]])
      )
      fetchRecipesWithQuery(queryParams)
    } else {
      fetchRecipesWithQuery()
    }
  })

  return {
    loadNextRecipes,
    reloadRecipes,
    recipes
  }
}
