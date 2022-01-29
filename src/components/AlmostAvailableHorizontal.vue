<template>
  <div class="almost-available-horizontal">
    <SectionTitle icon="basket" :title="$t('cookIt.buyMissingIngredient')" />
    <HorizontalRecipesList :recipes="favouriteRecipes" @show-all="showAllFavourites()" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import userApi from '@/api/userApi'

import { RecipeList } from '@/constants'

import { APP_FAVOURITES } from '@/router/names'

import HorizontalRecipesList from '@/components/HorizontalRecipesList.vue'
import SectionTitle from '@/components/SectionTitle.vue'

export default defineComponent({
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
      router.push({ name: APP_FAVOURITES })
    }

    return {
      favouriteRecipes,
      showAllFavourites
    }
  }
})
</script>

<style lang="scss" scoped>
.almost-available-horizontal {
  margin-top: 2rem;
  margin-bottom: 2rem;

  ::v-deep(.section-title) {
    margin-top: 0;
  }
}
</style>
