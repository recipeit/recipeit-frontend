<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader class="cook-it-page__header" :title="$t('cookIt.title')"></PageHeader>

      <template v-if="isAuthenticated">
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
      </template>
      <LoginBeforeEnter v-else></LoginBeforeEnter>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader.vue'
import LoginBeforeEnter from '@/components/LoginBeforeEnter'

export default {
  components: { GenericRecipesList, PageHeader, LoginBeforeEnter },
  name: 'CookIt',
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
    if (this.isAuthenticated && (this.availableRecipes.items === null || this.almostAvailableRecipes.items === null)) {
      this.fetchRecipes()
    }
  },
  methods: {
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

.cook-it-page {
  &__header {
    margin-bottom: 16px;
  }
}

.recipes-list-title {
  font-size: 14px;
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: bold;
}
</style>
