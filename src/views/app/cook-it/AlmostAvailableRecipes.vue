<template>
  <div class="layout__page__content">
    <PageHeader title="Pełna lista" :backButton="true" :search="true" />
    <div class="recipes-list-title">Te potrawy możesz przyrządzić po drobnych zakupach!</div>
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'AlmostAvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  data: () => ({
    getRecipesApiEndpoint: recipeApi.getRecipes
  }),
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters, search } = this.recipes
      this.$store.dispatch('recipes/fetchNextAlmostAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    },
    reloadRecipes({ orderMethod, filters, search }) {
      this.$store.dispatch('recipes/fetchAlmostAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.almostAvailableRecipes
    })
  },
  created() {
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchAlmostAvailableRecipes')
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
