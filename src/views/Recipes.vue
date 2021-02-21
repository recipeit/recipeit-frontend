<template>
  <div class="layout__page__content">
    <h1>{{ $t('recipes.title') }}</h1>
    <input v-model="searchValue" />
    <button @click="search">Szukaj</button>
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes"></GenericRecipesList>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'

export default {
  name: 'Recipes',
  components: {
    GenericRecipesList
  },
  data: () => ({
    getRecipesApiEndpoint: recipeApi.getRecipes,
    searchValue: null
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
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.recipes
    })
  },
  created() {
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchRecipes')
    }
  },
  beforeMount() {
    if (this.recipes.search) {
      this.searchValue = this.recipes.search
    }
  }
}
</script>

<style lang="scss" scoped></style>
