<template>
  <div class="layout__page__content">
    <PageHeader title="Ulubione" :back-button="true" />
    <GenericRecipesListWithoutFilters
      :show-filter-buttons="false"
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      :load-handler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
      @reload="recipesList.reloadRecipes()"
      @reload-with-query="recipesList.reloadRecipes()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

import userApi from '@/api/userApi'

import recipePagedList from '@/views/app/composable/recipePagedList'

import GenericRecipesListWithoutFilters from '@/components/GenericRecipesListWithoutFilters.vue'
import PageHeader from '@/components/PageHeader.vue'

export default defineComponent({
  name: 'AvailableRecipes',

  components: {
    GenericRecipesListWithoutFilters,
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
})
</script>
