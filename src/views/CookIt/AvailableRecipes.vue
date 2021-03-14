<template>
  <div class="layout__page__content">
    <PageHeader title="Pełna lista" :backButton="true" :search="true"></PageHeader>
    <div class="recipes-list-title">Te potrawy możesz przyrządzić z tego co masz w kuchni!</div>
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
  name: 'AvailableRecipes',
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
      this.$store.dispatch('recipes/fetchNextAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    },
    reloadRecipes({ orderMethod, filters, search }) {
      this.$store.dispatch('recipes/fetchAvailableRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
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
