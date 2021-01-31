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
import { recipesSortingMethods, defaultRecipesSortingMethod } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'

export default {
  name: 'Recipes',
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
    fetchRecipesQueryParams(orderMethod, filters) {
      return {
        pageNumber: null,
        orderMethod: orderMethod,
        ...this.parseFilters(filters)
      }
    },
    parseFilters(filters) {
      let renamedFilters = {}
      if (typeof filters === 'object' && filters !== null) {
        Object.keys(filters).forEach(group => {
          if (filters[group] && filters[group].length > 0) {
            renamedFilters[`filters.${group}`] = filters[group].join(',')
          }
        })
      }
      return renamedFilters
    },
    loadNextRecipes() {
      this.$store.dispatch(
        'recipes/fetchNextRecipes',
        this.fetchRecipesQueryParams(this.recipes.orderMethod, this.recipes.filters)
      )
    },
    reloadRecipes({ orderMethod, filters }) {
      this.$store.dispatch('recipes/fetchRecipes', this.fetchRecipesQueryParams(orderMethod, filters))
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
