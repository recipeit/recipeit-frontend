<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')" />

      <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes()" @reload="reloadRecipes($event)">
        <template v-if="!(!almostAvailableRecipes.fetching && almostAvailableRecipes.items.length === 0)" #above-list>
          <div class="almost-available-horizontal">
            <SectionTitle class="almost-available-horizontal-title" icon="basket" :title="$t('cookIt.buyMissingIngredient')" />
            <HorizontalRecipesList
              :recipes="almostAvailableRecipes"
              @showAll="$router.push({ name: 'almost-available', query: $route.query })"
            />
          </div>
        </template>
        <template #count="{ count, fetching}">
          <div v-if="count !== null && !fetching" class="recipes-count">
            <BaseIcon class="recipes-count-icon" icon="chef-hat" />
            <span>
              Znaleźliśmy <b>{{ $tc('shared.recipes', count) }}</b
              >, które możesz przygotować z tego, co juz masz!
            </span>
          </div>
          <div v-else class="recipes-count-loading">
            wczytuję
          </div>
        </template>
      </GenericRecipesList>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'

import HorizontalRecipesList from '@/components/HorizontalRecipesList'
import SectionTitle from '@/components/SectionTitle'

export default {
  name: 'CookIt',
  components: { GenericRecipesList, PageHeader, HorizontalRecipesList, SectionTitle },
  setup() {
    const recipes = ref(new RecipeList())
    const almostAvailableRecipes = ref(new RecipeList())
    const router = useRouter()
    const route = useRoute()

    const loadNextRecipes = () => {
      const { orderMethod, filters, search } = recipes.value
      fetchNextRecipes(orderMethod, filters, search)
    }

    const reloadRecipes = ({ orderMethod, filters, search }) => {
      fetchRecipes(orderMethod, filters, search)
    }

    const fetchNextRecipes = (orderMethod, filters, search) => {
      if (recipes.value.fetching) return
      recipes.value.fetching = true

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      userApi
        .getAvailableRecipes({
          ...queryParams,
          pageNumber: recipes.value.pagesTo + 1
        })
        .then(({ data }) => {
          recipes.value.addFromApi(data)
        })
    }

    const fetchRecipes = (orderMethod, filters, search) => {
      if (recipes.value.fetching) return

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      fetchRecipesWithQuery(queryParams)
    }

    const fetchRecipesWithQuery = queryParams => {
      recipes.value = new RecipeList()
      recipes.value.fetching = true

      userApi.getAvailableRecipes(queryParams).then(({ data }) => {
        recipes.value.setFromApi(data)

        const queryParams = fetchRecipesQueryParams(data.orderMethod, data.filters, data.search)
        router.replace({ query: queryParams })
      })

      almostAvailableRecipes.value.fetching = true
      userApi.getAlmostAvailableRecipes(queryParams).then(resp => {
        almostAvailableRecipes.value.setFromApi(resp.data)
      })
    }

    onBeforeMount(() => {
      var { query } = route

      if (query) {
        const queryParams = Object.fromEntries(
          Object.keys(query)
            .filter(key => key === 'search' || key === 'orderMethod' || key.startsWith('filters.'))
            .map(key => [key, query[key]])
        )
        fetchRecipesWithQuery(queryParams)
      } else {
        fetchRecipesWithQuery()
      }
    })

    return {
      loadNextRecipes,
      reloadRecipes,
      recipes,
      almostAvailableRecipes
    }
  }
}
</script>

<style lang="scss" scoped>
.cook-it-layout {
  display: flex;
  flex-direction: column;
}

.almost-available-horizontal {
  margin: 0.5rem 0;

  &-title {
    margin-top: 0;
  }
}

.recipes-count {
  padding: 1.25rem 1.5rem;
  border-radius: 1.5rem;
  color: var(--color-primary);
  font-weight: 500;
  background-color: var(--color-button-subtle-primary-background);
  display: flex;
  align-items: center;

  &-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
}
</style>
