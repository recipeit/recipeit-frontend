<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <h1>{{ $t('cookIt.title') }}</h1>

      <div>
        <GenericRecipesList
          :recipes="availableRecipes"
          :filterOptions="recipeFilterOptions"
          :sortingOptions="recipesSortingMethods"
          :defaultSortingOption="defaultRecipesSortingMethod"
          :showAllLink="{ name: 'available' }"
          :limitedItems="4"
          @reload="reloadAvailable"
        ></GenericRecipesList>
      </div>

      <div v-if="almostAvailableRecipes.items?.length > 0 || almostAvailableRecipes.filters">
        <div class="recipes-list-title">
          {{ $t('cookIt.buyMissingIngredient') }}
        </div>

        <GenericRecipesList
          :recipes="almostAvailableRecipes"
          :filterOptions="recipeFilterOptions"
          :sortingOptions="recipesSortingMethods"
          :defaultSortingOption="defaultRecipesSortingMethod"
          :showAllLink="{ name: 'almost-available' }"
          :limitedItems="4"
          @reload="reloadAlmostAvailable"
        ></GenericRecipesList>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { recipesSortingMethods, defaultRecipesSortingMethod, fetchRecipesQueryParams } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'

export default {
  components: { GenericRecipesList },
  name: 'CookIt',
  data() {
    return {
      recipesSortingMethods,
      defaultRecipesSortingMethod
    }
  },
  computed: {
    ...mapState({
      availableRecipes: state => state.recipes.availableRecipes,
      almostAvailableRecipes: state => state.recipes.almostAvailableRecipes,
      recipeFilterOptions: state => state.recipes.filterOptions
    })
  },
  created() {
    this.$store.dispatch('recipes/fetchRecipeFilterOptions')
    if (this.availableRecipes.items === null) {
      this.reloadAvailable({})
    }
    if (this.almostAvailableRecipes.items === null) {
      this.reloadAlmostAvailable({})
    }
  },
  methods: {
    reloadAvailable({ orderMethod, filters }) {
      this.$store.dispatch('recipes/fetchAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters))
    },
    reloadAlmostAvailable({ orderMethod, filters }) {
      this.$store.dispatch('recipes/fetchAlmostAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters))
    }
  }
}
</script>

<style lang="scss" scoped>
.cook-it-layout {
  display: flex;
  flex-direction: column;
}

.recipes-list-title {
  font-size: 14px;
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: bold;
}
</style>
