<template>
  <div>
    <SectionTitle
      icon="heart"
      title="Ulubione"
      actionText="zobacz wszystkie"
      :showAction="favouriteRecipesList.recipes.value.pagedItems[1]?.length > 0"
      @action-click="showAllFavourites()"
    />
    <HorizontalRecipesList
      :recipes="favouriteRecipesList.recipes.value"
      :errors="favouriteRecipesList.recipesErrors.value"
      @reload-with-query="loadFavouriteRecipes()"
      @showAll="showAllFavourites()"
    >
      <template #empty-list>
        <li v-for="i in 3" :key="i" class="empty-list-item">
          <AddToFavouriteRecipeBox />
        </li>
      </template>
    </HorizontalRecipesList>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { onBeforeMount } from '@vue/runtime-core'
import userApi from '@/api/userApi'
import { APP_FAVOURITES } from '@/router/names'
import HorizontalRecipesList from '@/components/HorizontalRecipesList'
import SectionTitle from '@/components/SectionTitle'
import AddToFavouriteRecipeBox from './AddToFavouriteRecipeBox'
import recipePagedList from '@/views/app/composable/recipePagedList'

export default {
  components: { HorizontalRecipesList, SectionTitle, AddToFavouriteRecipeBox },
  setup() {
    const router = useRouter()
    const favouriteRecipesList = recipePagedList(userApi.getFavouriteRecipes)

    const loadFavouriteRecipes = () => {
      favouriteRecipesList.loadRecipesPage(1, false)
    }

    const showAllFavourites = () => {
      router.push({ name: APP_FAVOURITES })
    }

    onBeforeMount(() => {
      loadFavouriteRecipes()
    })

    return {
      favouriteRecipesList,
      loadFavouriteRecipes,
      showAllFavourites
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-list-item {
  width: 150px;
  max-width: calc((100% - 64px) * 0.4);
  flex-shrink: 0;

  & + & {
    margin-left: 16px;
  }
}
</style>
