<template>
  <div>
    <SectionTitle
      icon="heart"
      title="Ulubione"
      action-text="zobacz wszystkie"
      :show-action="favouriteRecipesList.recipes.value.pagedItems[1]?.length > 0"
      @action-click="showAllFavourites()"
    />
    <HorizontalRecipesList
      :recipes="favouriteRecipesList.recipes.value"
      :errors="favouriteRecipesList.recipesErrors.value"
      @reload-with-query="loadFavouriteRecipes()"
      @show-all="showAllFavourites()"
    >
      <template #empty-list>
        <li v-for="i in 3" :key="i" class="empty-list-item">
          <AddToFavouriteRecipeBox />
        </li>
      </template>
    </HorizontalRecipesList>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import userApi from '@/api/userApi'

import { APP_FAVOURITES } from '@/router/names'

import recipePagedList from '@/views/app/composable/recipePagedList'

import AddToFavouriteRecipeBox from '@/components/AddToFavouriteRecipeBox.vue'
import HorizontalRecipesList from '@/components/HorizontalRecipesList.vue'
import SectionTitle from '@/components/SectionTitle.vue'

export default defineComponent({
  components: { AddToFavouriteRecipeBox, HorizontalRecipesList, SectionTitle },

  setup() {
    const router = useRouter()
    const favouriteRecipesList = recipePagedList(userApi.getFavouriteRecipes)

    const loadFavouriteRecipes = () => {
      favouriteRecipesList.loadRecipesPage(1)
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
})
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
