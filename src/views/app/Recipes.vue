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
      this.recipes = new RecipeList()
      this.recipes.fetching = true

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      recipeApi.getRecipes(queryParams).then(resp => {
        this.recipes.setFromApi(resp.data)
      })
    }
  },
  beforeMount() {
    this.fetchRecipes()
  }
}
</script>

<style lang="scss" scoped></style>
