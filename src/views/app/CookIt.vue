<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')" />

      <div>
        <GenericRecipesList :recipes="availableRecipes" :showAllLink="{ name: 'available' }" :limitedItems="4" @reload="reloadRecipes" />
      </div>

      <div v-if="almostAvailableRecipes.items?.length > 0">
        <SectionTitle icon="basket" :title="$t('cookIt.buyMissingIngredient')" />
        <GenericRecipesList
          :recipes="almostAvailableRecipes"
          :showAllLink="{ name: 'almost-available' }"
          :limitedItems="4"
          :showFilterButtons="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import SectionTitle from '@/components/SectionTitle'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'

export default {
  name: 'CookIt',
  components: { GenericRecipesList, SectionTitle, PageHeader },
  data: () => ({
    fetchedData: false,
    availableRecipes: new RecipeList(),
    almostAvailableRecipes: new RecipeList()
  }),
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
  },
  methods: {
    reloadRecipes({ orderMethod, filters, search }) {
      this.availableRecipes = new RecipeList()
      this.almostAvailableRecipes = new RecipeList()
      this.fetchRecipes(orderMethod, filters, search)
    },
    fetchRecipes(orderMethod, filters, search) {
      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)
      this.fetchRecipesWithQuery(queryParams)
    },
    fetchRecipesWithQuery(queryParams) {
      this.availableRecipes.fetching = true
      userApi.getAvailableRecipes(queryParams).then(({ data: recipes }) => {
        this.availableRecipes.setFromApi(recipes)

        const queryParams = fetchRecipesQueryParams(recipes.orderMethod, recipes.filters, recipes.search)
        this.$router.replace({ query: queryParams })
      })

      this.almostAvailableRecipes.fetching = true
      userApi.getAlmostAvailableRecipes(queryParams).then(resp => {
        this.almostAvailableRecipes.setFromApi(resp.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cook-it-layout {
  display: flex;
  flex-direction: column;
}
</style>
