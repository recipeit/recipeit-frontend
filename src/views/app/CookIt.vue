<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')" />

      <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes()" @reload="reloadRecipes($event)">
        <template #almost-available>
          <div class="almost-available-horizontal">
            <SectionTitle class="section-title" icon="basket" :title="$t('cookIt.buyMissingIngredient')" />
            <HorizontalRecipesList :recipes="almostAvailableRecipes" @showAll="$router.push({ name: 'almost-available' })" />
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
// import SectionTitle from '@/components/SectionTitle'
import PageHeader from '@/components/PageHeader'
// import AlmostAvailableHorizontal from '@/components/AlmostAvailableHorizontal'
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
  // data: () => ({
  //   fetchedData: false,
  //   availableRecipes: new RecipeList(),
  //   almostAvailableRecipes: new RecipeList()
  // }),
  // beforeMount() {
  //   var { query } = this.$route

  //   if (query) {
  //     const queryParams = Object.fromEntries(
  //       Object.keys(query)
  //         .filter(key => key === 'orderMethod' || key.startsWith('filters.'))
  //         .map(key => [key, query[key]])
  //     )
  //     this.fetchRecipesWithQuery(queryParams)
  //   } else {
  //     this.fetchRecipesWithQuery()
  //   }
  // },
  // methods: {
  //   reloadRecipes({ orderMethod, filters, search }) {
  //     this.availableRecipes = new RecipeList()
  //     this.almostAvailableRecipes = new RecipeList()
  //     this.fetchRecipes(orderMethod, filters, search)
  //   },
  //   fetchRecipes(orderMethod, filters, search) {
  //     const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)
  //     this.fetchRecipesWithQuery(queryParams)
  //   },
  //   fetchRecipesWithQuery(queryParams) {
  //     this.availableRecipes.fetching = true
  //     userApi.getAvailableRecipes(queryParams).then(({ data: recipes }) => {
  //       this.availableRecipes.setFromApi(recipes)

  //       const queryParams = fetchRecipesQueryParams(recipes.orderMethod, recipes.filters, recipes.search)
  //       this.$router.replace({ query: queryParams })
  //     })

  //     this.almostAvailableRecipes.fetching = true
  //     userApi.getAlmostAvailableRecipes(queryParams).then(resp => {
  //       this.almostAvailableRecipes.setFromApi(resp.data)
  //     })
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.cook-it-layout {
  display: flex;
  flex-direction: column;
}
</style>
