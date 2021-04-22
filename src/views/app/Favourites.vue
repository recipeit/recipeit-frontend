<template>
  <div class="layout__page__content">
    <PageHeader title="Ulubione" :backButton="true" />
    <GenericRecipesList :recipes="recipesList.recipes.value" @load-next="recipesList.loadNextRecipes()" :showFilterButtons="false" />
  </div>
</template>

<script>
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'
import recipePagedList from './composable/recipePagedList'

export default {
  name: 'AvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  setup() {
    const recipesList = recipePagedList(userApi.getFavouriteRecipes)

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
