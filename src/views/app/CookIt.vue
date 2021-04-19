<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')" />

      <div>
        <GenericRecipesList :recipes="availableRecipes" :showAllLink="{ name: 'available' }" :limitedItems="4" @reload="reloadRecipes" />
      </div>

      <div v-if="almostAvailableRecipes.items?.length > 0">
        <div class="recipes-list-title">
          <BaseIcon class="recipes-list-title-icon" icon="basket" />
          {{ $t('cookIt.buyMissingIngredient') }}
        </div>

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
import { mapGetters } from 'vuex'
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'

export default {
  components: { GenericRecipesList, PageHeader },
  name: 'CookIt',
  data: () => ({
    fetchedData: false,
    availableRecipes: new RecipeList(),
    almostAvailableRecipes: new RecipeList()
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
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
      this.availableRecipes = new RecipeList()
      this.almostAvailableRecipes = new RecipeList()
      this.fetchRecipes(orderMethod, filters, search)
    },
    fetchRecipes(orderMethod, filters, search) {
      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      this.availableRecipes.fetching = true
      userApi.getAvailableRecipes(queryParams).then(resp => {
        this.availableRecipes.setFromApi(resp.data)
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
