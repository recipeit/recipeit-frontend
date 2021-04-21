<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('recipes.title')" />
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes" />
  </div>
</template>

<script>
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'Recipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  data: () => ({
    recipes: new RecipeList()
  }),
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters, search } = this.recipes
      this.fetchNextRecipes(orderMethod, filters, search)
    },
    reloadRecipes({ orderMethod, filters, search }) {
      this.fetchRecipes(orderMethod, filters, search)
    },
    search() {
      this.fetchRecipes(this.recipes.orderMethod, this.recipes.filters, this.recipes.search)
    },
    fetchNextRecipes(orderMethod, filters, search) {
      if (this.recipes.fetching) return
      this.recipes.fetching = true

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      recipeApi
        .getRecipes({
          ...queryParams,
          pageNumber: this.recipes.pagesTo + 1
        })
        .then(resp => {
          this.recipes.addFromApi(resp.data)
        })
    },
    fetchRecipes(orderMethod, filters, search) {
      if (this.recipes.fetching) return

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      this.fetchRecipesWithQuery(queryParams)
    },
    fetchRecipesWithQuery(queryParams) {
      this.recipes = new RecipeList()
      this.recipes.fetching = true

      recipeApi.getRecipes(queryParams).then(({ data: recipes }) => {
        this.recipes.setFromApi(recipes)

        const queryParams = fetchRecipesQueryParams(recipes.orderMethod, recipes.filters, recipes.search)
        this.$router.replace({ query: queryParams })
      })
    }
  },
  beforeMount() {
    var { query } = this.$route

    if (query) {
      const queryParams = Object.fromEntries(
        Object.keys(query)
          .filter(key => key === 'orderMethod' || key.startsWith('filters.'))
          .map(key => [key, query[key]])
      )
      this.fetchRecipesWithQuery(queryParams)
    } else {
      this.fetchRecipesWithQuery()
    }
  }
}
</script>

<style lang="scss" scoped></style>
