<template>
  <div class="layout__page__content">
    <PageHeader title="Pełna lista" :backButton="true" :search="true" />
    <div class="recipes-list-title">Te potrawy możesz przyrządzić po drobnych zakupach!</div>
    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      @load-next="recipesList.loadNextRecipes()"
      @reload="recipesList.reloadRecipes($event)"
    />
  </div>
</template>

<script>
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'
import recipeFilteredPagedList from '../mixins/recipeFilteredPagedList'

export default {
  name: 'AlmostAvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  setup() {
    const recipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)

    return {
      recipesList
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
