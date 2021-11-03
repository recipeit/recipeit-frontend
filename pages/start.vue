<template>
  <div class="layout__page__content home-page">
    <PageHeader :title="$t(welcomeType)" />
    <div>
      <DayPlan />
    </div>
    <PopularCategories />
    <LatestFavouritesRecipes />
  </div>
</template>

<script>
// import { onBeforeMount, ref } from "vue";

import DayPlan from "@/src/components/DayPlan";
import LatestFavouritesRecipes from "@/src/components/LatestFavouritesRecipes";
import PageHeader from "@/src/components/PageHeader";
import PopularCategories from "@/src/components/PopularCategories";

export default {
  // name: "Home",
  components: {
    PageHeader,
    DayPlan,
    LatestFavouritesRecipes,
    PopularCategories,
  },
  layout: "app",
  setup() {
    const welcomeType = ref("");

    onBeforeMount(() => {
      const hour = new Date().getHours();
      welcomeType.value =
        hour < 5 || hour > 16
          ? "welcome.evening"
          : hour < 12
          ? "welcome.morning"
          : "welcome.afternoon";
    });

    return {
      welcomeType,
    };
  },
};
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
