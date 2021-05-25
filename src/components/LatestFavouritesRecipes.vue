<template>
  <div>
    <SectionTitle
      icon="heart"
      title="Ulubione"
      actionText="zobacz wszystkie"
      :showAction="favouriteRecipes.items"
      @action-click="showAllFavourites()"
    />
    <HorizontalRecipesList
      :recipes="favouriteRecipes"
      :errors="favouriteRecipesErrors"
      @showAll="showAllFavourites()"
      @reload-with-query="loadFavouriteRecipes()"
    />
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

export default {
  components: { HorizontalRecipesList, SectionTitle },
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

<style lang="scss" scoped></style>
