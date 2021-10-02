<template>
  <div class="layout__page__content">
    <PageHeader title="Ulubione" :back-button="true" />
    <GenericRecipesList
      :show-filter-buttons="false"
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      :load-handler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
      @reload="recipesList.reloadRecipes()"
      @reload-with-query="recipesList.reloadRecipes()"
    />
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'

import userApi from '@/api/userApi'

import recipePagedList from '@/views/app/composable/recipePagedList'

import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'

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
