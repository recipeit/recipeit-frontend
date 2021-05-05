import { RecipeList } from '@/constants'
import { onBeforeMount, ref } from '@vue/runtime-core'

export default function(apiEndpoint) {
  const recipes = ref(new RecipeList())
  const recipesErrors = ref(null)

  const loadNextRecipes = () => {
    fetchNextRecipes()
  }

  const reloadRecipes = () => {
    fetchRecipes()
  }

  const fetchNextRecipes = () => {
    if (recipes.value.fetching) return
    recipes.value.fetching = true
    recipesErrors.value = null

    const query = {
      pageNumber: recipes.value.pagesTo + 1
    }

    apiEndpoint(query)
      .then(({ data }) => {
        recipes.value.addFromApi(data)
      })
      .catch(() => {
        recipes.value.fetching = false
        recipesErrors.value = {
          messageId: 'ERORR',
          from: 'LOAD-NEXT'
        }
      })
  }

  const fetchRecipes = () => {
    if (recipes.value.fetching) return

    fetchRecipesWithQuery()
  }

  const fetchRecipesWithQuery = () => {
    recipes.value = new RecipeList()
    recipes.value.fetching = true
    recipesErrors.value = null

    apiEndpoint()
      .then(({ data }) => {
        recipes.value.setFromApi(data)
      })
      .catch(() => {
        recipes.value.fetching = false
        recipesErrors.value = {
          messageId: 'ERORR',
          from: 'RELOAD',
          query: null
        }
      })
  }

  onBeforeMount(() => {
    fetchRecipesWithQuery()
  })

  return {
    loadNextRecipes,
    reloadRecipes,
    recipes,
    recipesErrors
  }
}
