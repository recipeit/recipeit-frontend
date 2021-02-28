<template>
  <div class="layout__page__content">
    <PageHeader
      class="recipes-page__header"
      v-model="searchValue"
      :search="true"
      :title="$t('recipes.title')"
      @search="forceSearch()"
    ></PageHeader>
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes"></GenericRecipesList>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'Recipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  data: () => ({
    getRecipesApiEndpoint: recipeApi.getRecipes,
    searchValue: null,
    searchTimeoutCallback: null
  }),
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters } = this.recipes
      this.fetchNextRecipes(orderMethod, filters, this.searchValue)
    },
    reloadRecipes({ orderMethod, filters }) {
      this.fetchRecipes(orderMethod, filters, this.searchValue)
    },
    search() {
      this.fetchRecipes(this.recipes.orderMethod, this.recipes.filters, this.searchValue)
    },
    fetchNextRecipes(orderMethod, filters, search) {
      this.$store.dispatch('recipes/fetchNextRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    },
    fetchRecipes(orderMethod, filters, search) {
      this.$store.dispatch('recipes/fetchRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    },
    forceSearch() {
      if (this.searchTimeoutCallback) {
        clearTimeout(this.searchTimeoutCallback)
        this.searchTimeoutCallback = null
      }
      this.search()
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.recipes
    })
  },
  beforeMount() {
    if (this.recipes.search) {
      this.searchValue = this.recipes.search
    }
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchRecipes')
    }
  },
  watch: {
    searchValue() {
      if (this.searchTimeoutCallback) {
        clearTimeout(this.searchTimeoutCallback)
      }
      this.searchTimeoutCallback = setTimeout(() => {
        this.search()
      }, 750)
    }
  }
}
</script>

<style lang="scss" scoped>
.recipes-page {
  &__header {
    margin-bottom: 16px;
  }
}
</style>
