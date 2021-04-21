<template>
  <div class="layout__page__content">
    <PageHeader title="Pełna lista" :backButton="true" :search="true" />
    <div class="recipes-list-title">Te potrawy możesz przyrządzić z tego co masz w kuchni!</div>
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes" />
  </div>
</template>

<script>
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'

export default {
  name: 'AvailableRecipes',
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
        .getAvailableRecipes({
          ...queryParams,
          pageNumber: this.recipes.pagesTo + 1
        })
        .then(resp => {
          this.recipes.addFromApi(resp.data)
        })
    },
    reloadRecipes({ orderMethod, filters, search }) {
      if (this.recipes.fetching) return

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      this.reloadRecipesWithQuery(queryParams)
    },
    reloadRecipesWithQuery(queryParams) {
      this.recipes = new RecipeList()
      this.recipes.fetching = true

      userApi.getAvailableRecipes(queryParams).then(({ data: recipes }) => {
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
      this.reloadRecipesWithQuery(queryParams)
    } else {
      this.reloadRecipesWithQuery()
    }
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
