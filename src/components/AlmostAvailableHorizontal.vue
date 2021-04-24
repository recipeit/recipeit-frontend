<template>
  <div class="almost-available-horizontal">
    <SectionTitle class="section-title" icon="basket" :title="$t('cookIt.buyMissingIngredient')" />
    <HorizontalRecipesList :recipes="favouriteRecipes" @showAll="showAllFavourites()" />
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

export default {
  components: { HorizontalRecipesList, SectionTitle },
  setup() {
    const favouriteRecipes = ref(new RecipeList())
    const router = useRouter()

    onBeforeMount(async () => {
      favouriteRecipes.value.fetching = true
      const { data } = await userApi.getFavouriteRecipes()
      favouriteRecipes.value.setFromApi({ ...data, fetching: false })
    })

    const showAllFavourites = () => {
      router.push({ name: 'favourites' })
    }

    return {
      favouriteRecipes,
      showAllFavourites
    }
  }
}
</script>

<style lang="scss" scoped>
.almost-available-horizontal {
  margin-top: 2rem;
  margin-bottom: 2rem;

  .section-title {
    margin-top: 0;
  }
}
</style>
