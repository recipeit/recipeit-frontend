import { RecipeList } from '@/constants'
import { onBeforeMount, ref } from '@vue/runtime-core'

export default function(apiEndpoint) {
  const recipes = ref(new RecipeList())

  const loadNextRecipes = () => {
    fetchNextRecipes()
  }

  const reloadRecipes = () => {
    fetchRecipes()
  }

  const fetchNextRecipes = () => {
    if (recipes.value.fetching) return
    recipes.value.fetching = true

    apiEndpoint({
      pageNumber: recipes.value.pagesTo + 1
    }).then(({ data }) => {
      recipes.value.addFromApi(data)
    })
  }

  const fetchRecipes = () => {
    if (recipes.value.fetching) return

    fetchRecipesWithQuery()
  }

  const fetchRecipesWithQuery = () => {
    recipes.value = new RecipeList()
    recipes.value.fetching = true

    apiEndpoint().then(({ data }) => {
      recipes.value.setFromApi(data)
    })
  }

  onBeforeMount(() => {
    fetchRecipesWithQuery()
  })

  return {
    loadNextRecipes,
    reloadRecipes,
    recipes
  }
}
