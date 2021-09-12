<template>
  <div class="layout__page__content home-page">
    <PageHeader :title="$t(welcomeType)" />
    <DayPlan />
    <PopularCategories />
    <LatestFavouritesRecipes />
  </div>
</template>

<script>
import { onBeforeMount } from '@vue/runtime-core'
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader'
import DayPlan from '@/components/DayPlan'
import LatestFavouritesRecipes from '@/components/LatestFavouritesRecipes'
import PopularCategories from '@/components/PopularCategories'

export default {
  components: { PageHeader, DayPlan, LatestFavouritesRecipes, PopularCategories },
  name: 'Home',
  setup() {
    const welcomeType = ref('')

    onBeforeMount(() => {
      const hour = new Date().getHours()
      welcomeType.value = hour < 5 || hour > 16 ? 'welcome.evening' : hour < 12 ? 'welcome.morning' : 'welcome.afternoon'
    })

    return {
      welcomeType
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  &__title {
    font-size: 1.5rem;
    margin: 0;

    &__sub {
      font-size: 1rem;
      font-weight: 500;
      display: block;
    }
  }
}
</style>
