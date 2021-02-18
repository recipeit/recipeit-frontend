<template>
  <div class="layout__page__content">
    <h1>{{ $t('recipes.title') }}</h1>
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
    getRecipesApiEndpoint: recipeApi.getRecipes
  }),
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters } = this.recipes
      this.$store.dispatch('recipes/fetchNextRecipes', fetchRecipesQueryParams(orderMethod, filters))
    },
    reloadRecipes({ orderMethod, filters }) {
      this.$store.dispatch('recipes/fetchRecipes', fetchRecipesQueryParams(orderMethod, filters))
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
  }
}
</script>

<style lang="scss" scoped></style>
