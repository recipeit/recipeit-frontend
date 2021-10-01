<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('recipes.title')" />

    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      :load-handler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
      @reload="reloadRecipes($event)"
      @reload-with-query="reloadRecipesWithQuery($event)"
    >
      <template #above-list>
        <div v-if="availableRecipesCount !== 0" class="recipes-count" :class="{ 'hide-text': availableRecipesCount === null }">
          <BaseIcon class="recipes-count-icon" icon="chef-hat" />
          <span>
            <b>{{ $tc('shared.recipes', availableRecipesCount) }}</b> z tej listy możesz przygotować z produktów które masz!
            <router-link v-slot="{ href, navigate }" :to="{ name: 'cook-it', query: $route.query }" custom>
              <BaseLink :href="href" color="primary" class="cook-it-link" @click="navigate($event)">
                <template v-if="availableRecipesCount === 1">Sprawdź jaki</template>
                <template v-else>Sprawdź jakie</template>
              </BaseLink>
            </router-link>
          </span>
        </div>
      </template>
    </GenericRecipesList>
  </div>
</template>

<script>
import { ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useMeta } from 'vue-meta'

import { fetchRecipesQueryParams, queryParamsFromRouteQuery } from '@/constants'

import recipeApi from '@/api/recipeApi'
import userApi from '@/api/userApi'

import recipeFilteredPagedList from '@/views/app/composable/recipeFilteredPagedList'

import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'Recipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  props: {
    savedPosition: {
      type: String
    }
  },
  setup() {
    useMeta({
      title: 'Baza przepisów'
    })
    const route = useRoute()

    const availableRecipesCount = ref(null)

    const recipesList = recipeFilteredPagedList(recipeApi.getRecipes)

    const fetchAvailableRecipesCount = async ({ orderMethod, filters, search } = {}) => {
      availableRecipesCount.value = null

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      const { data } = await userApi.getAvailableRecipesCount(queryParams)

      availableRecipesCount.value = data
    }

    const reloadRecipes = event => {
      fetchAvailableRecipesCount(event)
      recipesList.reloadRecipes(event)
    }

    const reloadRecipesWithQuery = event => {
      fetchAvailableRecipesCount(event)
      recipesList.reloadRecipesWithQuery(event)
    }

    const initialQueryParams = queryParamsFromRouteQuery(route.query)
    fetchAvailableRecipesCount(initialQueryParams)

    return {
      recipesList,
      reloadRecipes,
      reloadRecipesWithQuery,
      availableRecipesCount
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  display: flex;
  flex-direction: column;
}

.recipes-count {
  margin-bottom: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1.5rem;
  color: var(--color-primary);
  font-weight: 500;
  font-size: 0.75rem;
  background-color: var(--color-button-subtle-primary-background);
  display: flex;
  align-items: center;
  width: 100%;

  @include transition((background-color, color, opacity, visibility));

  &.hide-text {
    color: transparent;
    background-color: var(--color-image-background);

    * {
      visibility: hidden;
      opacity: 0;
    }
  }

  &-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
  }

  .cook-it-link {
    font-weight: 700;
    text-decoration: underline;
  }
}
</style>
