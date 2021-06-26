<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('recipes.title')" />

    <!-- <div class="grid" ref="grid">
      <template v-for="({ item, page }, index) in itemsList">
        <RecipeBox v-if="item" :key="item.id" :recipeId="item.id" :recipeName="item.name" />
        <SkeletonRecipeBox v-else :key="index" :animate="false" @element-mounted="skeletonBoxMountedHandler(page, $event)" />
      </template>
    </div> -->

    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      :loadHandler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
      @reload="recipesList.reloadRecipes($event)"
      @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
    />
    <!-- <li class="recipes-list__list__item recipes-list__list__item--skeleton">
      <SkeletonRecipeBox />
    </li> -->

    <!-- <template v-if="recipesList.recipes.value.items">
      <Grid class="grid" :length="recipesList.recipes.value.totalCount" :pageSize="12" :pageProvider="pageProvider">
        <template v-slot:default="{ item: { id, name, rating }, style }">
          <RecipeBox :style="style" :recipeId="id" :recipeName="name" :recipeRating="rating" />
        </template>

        <template v-slot:placeholder="{ style }">
          <SkeletonRecipeBox :style="style" />
        </template>

        <template v-slot:probe>
          <SkeletonRecipeBox />
        </template>
      </Grid>
    </template> -->
    <!-- <div style="height: 6000px"></div> -->
  </div>
</template>

<script>
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import recipeFilteredPagedList from './composable/recipeFilteredPagedList'
import { useMeta } from 'vue-meta'
// import { ref } from '@vue/reactivity'
// import { computed, onBeforeMount, onBeforeUnmount, onMounted } from '@vue/runtime-core'
// import Grid from 'vue-virtual-scroll-grid'
// import RecipeBox from '@/components/RecipeBox'
// import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox'

export default {
  name: 'Recipes',
  components: {
    // Grid,
    GenericRecipesList,
    PageHeader
    // RecipeBox,
    // SkeletonRecipeBox
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

    const recipesList = recipeFilteredPagedList(recipeApi.getRecipes)

    // to props
    // const pages = ref({})
    // const PAGE_SIZE = 12
    // const itemsCount = ref()

    // const grid = ref()
    // const initialHeight = ref()
    // const requiredItems = ref()

    // const itemsList = computed(() => {
    //   const loadedPageNumbers = Object.keys(pages.value).map(e => parseInt(e))
    //   const lastLoadedPage = loadedPageNumbers?.length > 0 ? Math.max(...loadedPageNumbers) : 0

    //   const result = []
    //   for (var i = 1; i <= lastLoadedPage + 1; i++) {
    //     const loadedPage = pages.value[i]
    //     if (loadedPage?.length > 0) {
    //       result.push(...loadedPage.map(item => ({ page: i, item })))
    //     } else {
    //       result.push(...Array(PAGE_SIZE).fill({ page: i, item: null }))
    //     }
    //   }

    //   let additionalItems = 0
    //   if (requiredItems.value > result.length) {
    //     // czyli chcemy żeby było więcej dorzucone
    //     if (itemsCount.value) {
    //       // czyli już zaczytaliśmy jakąś stronkę
    //       if (itemsCount.value > result.length) {
    //         // weryfikujemy czy jeszcze jest co wczytywać
    //         additionalItems = Math.min(itemsCount.value, requiredItems.value) - result.length
    //         // blokujemy opcję dorenderowania elementów które nie istnieją
    //       }
    //     } else {
    //       // czyli jest to inital state, nie wiemy ile elementów ma lista
    //       additionalItems = requiredItems.value - result.length
    //     }
    //   }

    //   const additionalPages = Math.ceil(additionalItems / PAGE_SIZE)

    //   for (var j = 1; j <= additionalPages; j++) {
    //     const itemsCountToAdd = j === additionalPages ? additionalItems % PAGE_SIZE || PAGE_SIZE : PAGE_SIZE
    //     result.push(...Array(itemsCountToAdd).fill({ page: j, item: null }))
    //   }

    //   return result
    // })

    // const intersectionObservers = {}
    // const fetchingPages = {}
    // const skeletonBoxMountedHandler = (pageNumber, el) => {
    //   let observer = intersectionObservers[pageNumber]

    //   if (!observer) {
    //     observer = new IntersectionObserver(
    //       ([entry]) => {
    //         if (entry && entry.isIntersecting) {
    //           if (!fetchingPages[pageNumber]) {
    //             fetchingPages[pageNumber] = true
    //             recipesList
    //               .loadRecipesPage(pageNumber)
    //               .then(result => {
    //                 pages.value[pageNumber] = result
    //                 observer.disconnect()
    //               })
    //               .catch(() => {
    //                 delete fetchingPages[pageNumber]
    //               })
    //           }
    //         }
    //       },
    //       { rootMargin: '256px' }
    //     )

    //     intersectionObservers[pageNumber] = observer
    //   }

    //   if (el) {
    //     observer.observe(el)
    //   }
    // }

    // onBeforeMount(() => {
    //   const { top } = history.state?.scroll || {}
    //   if (top) {
    //     initialHeight.value = top + window.innerHeight
    //   }
    // })

    // onMounted(() => {
    //   if (initialHeight.value) {
    //     const { offsetWidth: gridWidth } = grid.value || {}
    //     const { offsetHeight, offsetWidth } = grid.value?.children[0] || {}

    //     const gridRowGap = parseFloat(getComputedStyle(grid.value).rowGap)
    //     const gridColumnGap = parseFloat(getComputedStyle(grid.value).columnGap)

    //     const rows = Math.ceil(initialHeight.value / (offsetHeight + gridRowGap))
    //     const columns = Math.floor((gridWidth + gridColumnGap) / (offsetWidth + gridColumnGap))

    //     requiredItems.value = rows * columns
    //   }
    // })

    // onBeforeUnmount(() => {
    //   Object.values(intersectionObservers).forEach(observer => {
    //     observer?.disconnect()
    //   })
    // })

    // const initialStyle = computed(() => {
    //   if (initialHeight.value) {
    //     return `min-height: ${initialHeight.value}px`
    //   }
    //   return null
    // })

    return {
      recipesList
      // pages
      // grid,
      // initialHeight,
      // initialStyle,
      // requiredItems,
      // itemsList,
      // skeletonBoxMountedHandler
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  display: flex;
  flex-direction: column;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  @media (min-width: 721px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
