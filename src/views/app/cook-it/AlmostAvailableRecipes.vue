<template>
  <div class="layout__page__content">
    <PageHeader title="Pełna lista" :backButton="true" :search="true" />
    <div class="recipes-list-title">Te potrawy możesz przyrządzić po drobnych zakupach!</div>
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes" />
  </div>
</template>

<script>
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'

export default {
  name: 'AlmostAvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  data: () => ({
    recipes: new RecipeList()
  }),
  methods: {
    loadNextRecipes() {
      if (this.recipes.fetching) return
      this.recipes.fetching = true

      const { orderMethod, filters, search } = this.recipes
      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      userApi
        .getAlmostAvailableRecipes({
          ...queryParams,
          pageNumber: this.recipes.pagesTo + 1
        })
        .then(resp => {
          this.recipes.addFromApi(resp.data)
        })
    },
    reloadRecipes(orderMethod, filters, search) {
      if (this.recipes.fetching) return
      this.recipes = new RecipeList()
      this.recipes.fetching = true

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      userApi.getAlmostAvailableRecipes(queryParams).then(resp => {
        this.recipes.setFromApi(resp.data)
      })
    }
  },
  beforeMount() {
    this.reloadRecipes()
  }
}
</script>

<style lang="scss" scoped>
.recipes-list-title {
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: bold;
}
</style>
