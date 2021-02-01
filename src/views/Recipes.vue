<template>
  <div class="layout__page__content">
    <h1>{{ $t('recipes.title') }}</h1>
    <GenericRecipesList
      :recipes="recipes"
      :filterOptions="recipeFilterOptions"
      :sortingOptions="recipesSortingMethods"
      :defaultSortingOption="defaultRecipesSortingMethod"
      @load-next="loadNextRecipes"
      @reload="reloadRecipes"
    ></GenericRecipesList>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { recipesSortingMethods, defaultRecipesSortingMethod, fetchRecipesQueryParams } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'

export default {
  name: 'Recipes',
  components: {
    GenericRecipesList
  },
  data: () => ({
    getRecipesApiEndpoint: recipeApi.getRecipes,
    recipesSortingMethods,
    defaultRecipesSortingMethod
  }),
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters } = this.recipes
      this.$store.dispatch('recipes/fetchNextRecipes', fetchRecipesQueryParams(orderMethod, filters))
    },
    reloadRecipes({ orderMethod, filters }) {
      this.$store.dispatch('recipes/fetchRecipes', fetchRecipesQueryParams(orderMethod, filters))
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.recipes,
      recipeFilterOptions: state => state.recipes.filterOptions
    })
  },
  created() {
    if (this.recipeFilterOptions === null) {
      this.$store.dispatch('recipes/fetchRecipeFilterOptions')
    }
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchRecipes')
    }
  }
}
</script>

<style lang="scss" scoped></style>
