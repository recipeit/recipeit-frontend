<template>
  <div class="layout__page__content">
    <PageHeader class="recipes-page__header" :title="$t('recipes.title')"></PageHeader>
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
    getRecipesApiEndpoint: recipeApi.getRecipes
  }),
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters, search } = this.recipes
      this.fetchNextRecipes(orderMethod, filters, search)
    },
    reloadRecipes({ orderMethod, filters, search }) {
      this.fetchRecipes(orderMethod, filters, search)
    },
    search() {
      this.fetchRecipes(this.recipes.orderMethod, this.recipes.filters, this.recipes.search)
    },
    fetchNextRecipes(orderMethod, filters, search) {
      this.$store.dispatch('recipes/fetchNextRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    },
    fetchRecipes(orderMethod, filters, search) {
      this.$store.dispatch('recipes/fetchRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.recipes
    })
  },
  beforeMount() {
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchRecipes')
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
