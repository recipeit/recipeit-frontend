<template>
  <div class="layout__page__content">
    <PageHeader title="Ulubione" :backButton="true" />
    <GenericRecipesList
      :showFilterButtons="false"
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      @load-next="recipesList.loadNextRecipes()"
      @reload-with-query="recipesList.reloadRecipes()"
    />
  </div>
</template>

<script>
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'
import recipePagedList from './composable/recipePagedList'
import { useMeta } from 'vue-meta'

export default {
  name: 'AvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  setup() {
    useMeta({
      title: 'Ulubione'
    })

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
