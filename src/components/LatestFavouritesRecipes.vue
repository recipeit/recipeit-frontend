<template>
  <div>
    <SectionTitle
      icon="heart"
      title="Ulubione"
      actionText="zobacz wszystkie"
      :showAction="favouriteRecipes.items?.length > 0"
      @action-click="showAllFavourites()"
    />
    <HorizontalRecipesList
      :recipes="favouriteRecipes"
      :errors="favouriteRecipesErrors"
      @showAll="showAllFavourites()"
      @reload-with-query="loadFavouriteRecipes()"
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
import { ref } from 'vue'
import userApi from '@/api/userApi'
import { RecipeList } from '@/constants'
import HorizontalRecipesList from '@/components/HorizontalRecipesList'
import SectionTitle from '@/components/SectionTitle'
import { APP_FAVOURITES } from '@/router/names'
import AddToFavouriteRecipeBox from './AddToFavouriteRecipeBox.vue'

export default {
  components: { HorizontalRecipesList, SectionTitle, AddToFavouriteRecipeBox },
  setup() {
    const favouriteRecipes = ref(new RecipeList())
    const favouriteRecipesErrors = ref(new RecipeList())
    const router = useRouter()

    const loadFavouriteRecipes = async () => {
      favouriteRecipes.value.fetching = true
      favouriteRecipesErrors.value = null

      try {
        const { data } = await userApi.getFavouriteRecipes()
        favouriteRecipes.value.setFromApi({ ...data, fetching: false })
      } catch {
        favouriteRecipes.value.fetching = false
        favouriteRecipesErrors.value = {
          messageId: 'ERORR',
          from: 'RELOAD'
        }
      }
    }

    onBeforeMount(async () => {
      await loadFavouriteRecipes()
    })

    const showAllFavourites = () => {
      router.push({ name: APP_FAVOURITES })
    }

    return {
      favouriteRecipes,
      favouriteRecipesErrors,
      showAllFavourites,
      loadFavouriteRecipes
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
