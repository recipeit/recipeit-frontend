<template>
  <div class="layout__page__content">
    <h1>Pełna lista</h1>
    <div>Te potrawy możesz przyrządzić z tego co masz w kuchni!</div>
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
  name: 'AvailableRecipes',
  components: {
    GenericRecipesList
  },
  data() {
    return {
      getRecipesApiEndpoint: recipeApi.getRecipes,
      recipesSortingMethods,
      defaultRecipesSortingMethod
    }
  },
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters } = this.recipes
      this.$store.dispatch('recipes/fetchNextAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters))
    },
    reloadRecipes({ orderMethod, filters }) {
      this.$store.dispatch('recipes/fetchAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters))
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.availableRecipes,
      recipeFilterOptions: state => state.recipes.filterOptions
    })
  },
  created() {
    if (this.recipeFilterOptions === null) {
      this.$store.dispatch('recipes/fetchRecipeFilterOptions')
    }
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchAvailableRecipes')
    }
  }
}
</script>

<style></style>
