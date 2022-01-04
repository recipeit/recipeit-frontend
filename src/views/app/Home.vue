<template>
  <div class="layout__page__content home-page">
    <PageHeader :title="$t(welcomeType)" />
    <DayPlan />
    <PopularCategories />
    <LatestFavouritesRecipes />
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'

import DayPlan from '@/components/DayPlan.vue'
import LatestFavouritesRecipes from '@/components/LatestFavouritesRecipes.vue'
import PageHeader from '@/components/PageHeader.vue'
import PopularCategories from '@/components/PopularCategories.vue'

export default {
  name: 'Home',
  components: { PageHeader, DayPlan, LatestFavouritesRecipes, PopularCategories },
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
