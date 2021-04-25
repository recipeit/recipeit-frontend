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

        <template #empty-without-filters>
          <div v-if="kitchenProductsCount === 0" class="empty-list-message">
            <p class="empty-list-message-title">Najpierw dodaj coś do swojej kuchni</p>
            <router-link :to="{ name: 'my-kitchen' }" v-slot="{ href, navigate }" custom>
              <BaseButton tag="a" :href="href" @click="navigate($event)" stroked>
                Przejdź do kuchni
              </BaseButton>
            </router-link>
          </div>
          <div v-else class="empty-list-message">
            <p class="empty-list-message-title">Nie znaleźliśmy przepisów pasujących do Twoich produktów</p>
            <p class="empty-list-message-sub">
              <router-link :to="{ name: 'almost-available', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" color="primary" class="empty-list-message-link">
                  Zobacz propozycje przepisów
                </BaseLink> </router-link
              >, które przygotujesz po dokupieniu paru składników
            </p>
          </div>
        </template>
      </GenericRecipesList>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
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
    const store = useStore()
    const kitchenProductsCount = computed(() => store.state.myKitchen.products?.length || 0)

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
      kitchenProductsCount,
      loadNextRecipes,
      reloadRecipes,
      recipes,
      almostAvailableRecipes
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  display: flex;
  flex: 1;
}

.cook-it-layout {
  display: flex;
  flex: 1;
  width: 100%;
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

.empty-list-message {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  &-title {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  &-link {
    font-weight: bold;
  }

  &-sub {
    font-size: 0.75rem;
  }
}
</style>
