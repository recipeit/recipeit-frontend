<template>
  <div class="layout__page__content">
    <h1>Pełna lista</h1>
    <div class="recipes-list-title">Te potrawy możesz przyrządzić z tego co masz w kuchni!</div>
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes"></GenericRecipesList>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'

export default {
  name: 'AvailableRecipes',
  components: {
    GenericRecipesList
  },
  data: () => ({
    getRecipesApiEndpoint: recipeApi.getRecipes
  }),
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters } = this.recipes
      this.$store.dispatch('recipes/fetchNextAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters))
    },
    reloadRecipes({ orderMethod, filters }) {
      this.$store.dispatch('recipes/fetchAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters))
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.availableRecipes
    })
  },
  created() {
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchAvailableRecipes')
    }
  }
}
</script>

<style lang="scss" scoped>
.recipes-list-title {
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: bold;
}
</style>
