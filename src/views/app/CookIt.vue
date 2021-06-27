<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')" />

      <GenericRecipesList
        :recipes="recipesList.recipes.value"
        :errors="recipesList.recipesErrors.value"
        :loadHandler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
        @reload="reloadRecipes($event)"
        @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
      >
        <!-- <template v-if="!(!almostAvailableRecipes.fetching && Object.keys(almostAvailableRecipesList.recipes.value.pagedItems).length === 0)" #above-list> -->
        <!-- <template  #above-list> -->
        <template
          v-if="
            !(
              !Object.values(almostAvailableRecipesList.recipes.value.fetchingPages).some(v => v) &&
              Object.keys(almostAvailableRecipesList.recipes.value.pagedItems).length === 0
            )
          "
          #above-list
        >
          <div class="almost-available-horizontal">
            <SectionTitle icon="basket" :title="$t('cookIt.buyMissingIngredient')" />
            <HorizontalRecipesList
              :recipes="almostAvailableRecipesList.recipes.value"
              :errors="almostAvailableRecipesList.recipesErrors.value"
              @reload-with-query="almostAvailableRecipesList.reloadRecipesWithQuery($event)"
              @showAll="$router.push({ name: 'almost-available', query: $route.query })"
            />
          </div>
        </template>

        <template #count="{ count, fetching }">
          <div v-if="count !== null && !fetching" class="recipes-count">
            <BaseIcon class="recipes-count-icon" icon="chef-hat" />
            <span>
              Znaleźliśmy <b>{{ $tc('shared.recipes', count) }}</b
              >, które możesz przygotować z tego, co juz masz!
            </span>
          </div>
          <div v-else-if="fetching" class="recipes-count-loading">
            wczytuję
          </div>
        </template>

        <template #empty-with-filters>
          <div class="empty-list-message">
            <p class="empty-list-message-title">Nie znaleźliśmy przepisów dla użytych filtrów</p>
            <p v-if="almostAvailableRecipes.items?.length > 0" class="empty-list-message-sub">
              Możesz
              <BaseLink tag="button" @click="reloadRecipes({})" class="empty-list-message-link" color="primary">
                wyczyścić filtry
              </BaseLink>
              , przeszukać całą
              <router-link :to="{ name: 'recipes', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" class="empty-list-message-link" color="primary">bazę przepisów</BaseLink>
              </router-link>
              , bądź sprawdzić
              <router-link :to="{ name: 'almost-available', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" class="empty-list-message-link" color="primary">
                  propozycje przepisów
                </BaseLink>
              </router-link>
              po dokupieniu paru składników.
            </p>
            <p v-else class="empty-list-message-sub">
              Możesz
              <BaseLink tag="button" @click="reloadRecipes({})" class="empty-list-message-link" color="primary">
                wyczyścić filtry
              </BaseLink>
              lub sprawdzić całą
              <router-link :to="{ name: 'recipes', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" class="empty-list-message-link" color="primary">bazę przepisów</BaseLink>
              </router-link>
              .
            </p>
            <!-- <BaseButton stroked @click="clearFilters()">Wyczyść filtry</BaseButton> -->
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
import { computed } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import { fetchRecipesQueryParams } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'

import HorizontalRecipesList from '@/components/HorizontalRecipesList'
import SectionTitle from '@/components/SectionTitle'
import { useMeta } from 'vue-meta'
// import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import recipeFilteredPagedList from './composable/recipeFilteredPagedList'

export default {
  name: 'CookIt',
  components: { GenericRecipesList, PageHeader, HorizontalRecipesList, SectionTitle },
  setup() {
    useMeta({
      title: 'Ugotuj to!'
    })

    const store = useStore()
    const kitchenProductsCount = computed(() => store.state.myKitchen.products?.length || 0)

    const recipesList = recipeFilteredPagedList(userApi.getAvailableRecipes)
    const almostAvailableRecipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)
    almostAvailableRecipesList.loadRecipesPage(1, false)

    // const recipes = ref(new RecipeList())
    // const recipesErrors = ref(null)

    // const almostAvailableRecipes = ref(new RecipeList())
    // const almostAvailableRecipesErrors = ref(null)

    // const router = useRouter()
    // const route = useRoute()

    // const loadNextRecipes = () => {
    //   const { orderMethod, filters, search } = recipes.value
    //   fetchNextRecipes(orderMethod, filters, search)
    // }

    const reloadRecipes = ({ orderMethod, filters, search }) => {
      const query = { orderMethod, filters, search }
      // const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      recipesList.reloadRecipes(query)
      almostAvailableRecipesList.reloadRecipes(query)
      almostAvailableRecipesList.loadRecipesPage(1, false)

      // fetchRecipes(orderMethod, filters, search)
    }

    // const fetchBothRecipesWithQuery = queryParams => {
    //   recipesList.reloadRecipes
    // fetchAvailableRecipesWithQuery(queryParams)
    // fetchAlmostAvailableRecipesWithQuery(queryParams)
    // }

    // const fetchNextRecipes = (orderMethod, filters, search) => {
    //   if (recipes.value.fetching) return
    //   recipes.value.fetching = true
    //   recipesErrors.value = null

    //   const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

    //   userApi
    //     .getAvailableRecipes({
    //       ...queryParams,
    //       pageNumber: recipes.value.pagesTo + 1
    //     })
    //     .then(({ data }) => {
    //       recipes.value.addFromApi(data)
    //     })
    //     .catch(error => {
    //       recipes.value.fetching = false
    //       recipesErrors.value = {
    //         messageId: 'ERORR',
    //         from: 'LOAD-NEXT'
    //       }
    //       this.$errorHandler.captureError(error, {
    //         [ERROR_ACTION_TAG_NAME]: 'cookIt.fetchNextRecipes'
    //       })
    //     })
    // }

    // const fetchRecipes = (orderMethod, filters, search) => {
    //   // if (recipes.value.fetching) return

    //   const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

    //   fetchBothRecipesWithQuery(queryParams)
    // }

    // const fetchAvailableRecipesWithQuery = queryParams => {
    //   recipes.value = new RecipeList()
    //   recipes.value.fetching = true
    //   recipesErrors.value = null

    //   userApi
    //     .getAvailableRecipes(queryParams)
    //     .then(({ data }) => {
    //       recipes.value.setFromApi(data)

    //       const queryParams = fetchRecipesQueryParams(data.orderMethod, data.filters, data.search)
    //       router.replace({ query: queryParams })
    //     })
    //     .catch(error => {
    //       recipes.value.fetching = false
    //       recipesErrors.value = {
    //         messageId: 'ERORR',
    //         from: 'RELOAD',
    //         query: queryParams
    //       }
    //       this.$errorHandler.captureError(error, {
    //         [ERROR_ACTION_TAG_NAME]: 'cookIt.fetchAvailableRecipesWithQuery'
    //       })
    //     })
    // }

    // const fetchAlmostAvailableRecipesWithQuery = queryParams => {
    //   almostAvailableRecipes.value = new RecipeList()
    //   almostAvailableRecipes.value.fetching = true
    //   almostAvailableRecipesErrors.value = null

    //   userApi
    //     .getAlmostAvailableRecipes(queryParams)
    //     .then(resp => {
    //       almostAvailableRecipes.value.setFromApi(resp.data)
    //     })
    //     .catch(error => {
    //       almostAvailableRecipes.value.fetching = false
    //       almostAvailableRecipesErrors.value = {
    //         messageId: 'ERORR',
    //         from: 'RELOAD',
    //         query: queryParams
    //       }
    //       this.$errorHandler.captureError(error, {
    //         [ERROR_ACTION_TAG_NAME]: 'cookIt.fetchAlmostAvailableRecipesWithQuery'
    //       })
    //     })
    // }

    // onBeforeMount(() => {
    //   var { query } = route

    //   if (query) {
    //     const queryParams = Object.fromEntries(
    //       Object.entries(query).filter(([key]) => key === 'search' || key === 'orderMethod' || key.startsWith('filters.'))
    //     )
    //     fetchBothRecipesWithQuery(queryParams)
    //   } else {
    //     fetchBothRecipesWithQuery()
    //   }
    // })

    return {
      kitchenProductsCount,
      recipesList,
      almostAvailableRecipesList,
      reloadRecipes
      // loadNextRecipes,
      // recipes,
      // recipesErrors,
      // almostAvailableRecipes,
      // almostAvailableRecipesErrors,
      // fetchAvailableRecipesWithQuery,
      // fetchAlmostAvailableRecipesWithQuery
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

  ::v-deep(.section-title) {
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
  width: 100%;

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
