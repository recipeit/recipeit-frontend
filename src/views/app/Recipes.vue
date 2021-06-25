<template>
  <div class="layout__page__content" :style="initialStyle">
    <PageHeader :title="$t('recipes.title')" />
    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      @load-next="recipesList.loadNextRecipes()"
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
import { ref } from '@vue/reactivity'
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

    const pageProvider = pageNumber =>
      new Promise(resolve => {
        recipesList.loadRecipesPage(pageNumber + 1).then(result => {
          // console.log('result', pageNumber + 1, pageSize, result)
          resolve(result)
        })
      })

    const initialStyle = ref()

    return {
      recipesList,
      pageProvider,
      initialStyle
    }
  },
  beforeMount() {
    // const { top } = history.state.scroll
    // if (top) {
    //   this.initialStyle = `min-height: ${top + window.innerHeight}px`
    // }
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
