<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('recipes.title')" />
    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      @load-next="recipesList.loadNextRecipes()"
      @reload="recipesList.reloadRecipes($event)"
      @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
    />
  </div>
</template>

<script>
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import recipeFilteredPagedList from './composable/recipeFilteredPagedList'

export default {
  name: 'Recipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  setup() {
    const recipesList = recipeFilteredPagedList(recipeApi.getRecipes)

    return {
      recipesList
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  display: flex;
  flex-direction: column;
}
</style>
