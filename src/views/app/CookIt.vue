<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')"></PageHeader>

      <!-- <template v-if="isAuthenticated"> -->
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
          <BaseIcon class="recipes-list-title-icon" icon="basket" />
          {{ $t('cookIt.buyMissingIngredient') }}
        </div>

        <GenericRecipesList
          :recipes="almostAvailableRecipes"
          :showAllLink="{ name: 'almost-available' }"
          :limitedItems="4"
          :showFilterButtons="false"
        ></GenericRecipesList>
      </div>
      <!-- </template> -->
      <!-- <LoginBeforeEnter v-else></LoginBeforeEnter> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader.vue'
// import LoginBeforeEnter from '@/components/LoginBeforeEnter'

export default {
  components: { GenericRecipesList, PageHeader },
  name: 'CookIt',
  data: () => ({
    fetchedData: false
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    ...mapState({
      availableRecipes: state => state.recipes.availableRecipes,
      almostAvailableRecipes: state => state.recipes.almostAvailableRecipes
    })
  },
  beforeMount() {
    this.tryFetchInitialData()
  },
  watch: {
    isAuthenticated(newValue) {
      if (newValue && !this.fetchedData) {
        this.tryFetchInitialData()
      }
    }
  },
  methods: {
    tryFetchInitialData() {
      if (this.fetchedData) return

      if (this.isAuthenticated && (this.availableRecipes.items === null || this.almostAvailableRecipes.items === null)) {
        this.fetchRecipes()
        this.fetchedData = true
      }
    },
    reloadRecipes({ orderMethod, filters, search }) {
      this.fetchRecipes(orderMethod, filters, search)
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
  display: flex;
  font-size: 14px;
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: bold;
  align-items: center;

  &-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
    color: var(--color-primary);
  }
}
</style>
