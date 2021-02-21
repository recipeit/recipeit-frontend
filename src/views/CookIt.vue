<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <h1>{{ $t('cookIt.title') }}</h1>
      <input v-model="searchValue" />
      <button @click="search">Szukaj</button>

      <div>
        <GenericRecipesList
          :recipes="availableRecipes"
          :showAllLink="{ name: 'available' }"
          :limitedItems="4"
          @reload="reloadRecipes"
        ></GenericRecipesList>
      </div>

      <div v-if="almostAvailableRecipes.items?.length > 0 || almostAvailableRecipes.filters">
        <div class="recipes-list-title">
          {{ $t('cookIt.buyMissingIngredient') }}
        </div>

        <GenericRecipesList
          :recipes="almostAvailableRecipes"
          :showAllLink="{ name: 'almost-available' }"
          :limitedItems="4"
          :showFilterButtons="false"
        ></GenericRecipesList>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'

export default {
  components: { GenericRecipesList },
  name: 'CookIt',
  data: () => ({
    searchValue: null
  }),
  computed: {
    ...mapState({
      availableRecipes: state => state.recipes.availableRecipes,
      almostAvailableRecipes: state => state.recipes.almostAvailableRecipes
    })
  },
  created() {
    if (this.availableRecipes.items === null || this.almostAvailableRecipes.items === null) {
      this.fetchRecipes()
    }
  },
  methods: {
    reloadRecipes({ orderMethod, filters }) {
      this.fetchRecipes(orderMethod, filters, this.searchValue)
    },
    search() {
      this.fetchRecipes(this.availableRecipes.orderMethod, this.availableRecipes.filters, this.searchValue)
    },
    fetchRecipes(orderMethod, filters, search) {
      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)
      this.$store.dispatch('recipes/fetchAvailableRecipes', queryParams)
      this.$store.dispatch('recipes/fetchAlmostAvailableRecipes', queryParams)
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
