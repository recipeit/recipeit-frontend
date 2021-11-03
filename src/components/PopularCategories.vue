<template>
  <div>
    <SectionTitle icon="star" title="Popularne kategorie" />
    <div class="popular-categories-container">
      <ul v-if="popularCategories" class="popular-categories">
        <li
          v-for="category in popularCategories"
          :key="category.key"
          class="popular-category-container"
        >
          <PopularCategory
            :page="page"
            :category-key="category.key"
            :category-value="category.value"
            :category-group="category.categoryGroup"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import { onBeforeMount, ref } from "vue";

import recipeApi from "@/src/api/recipeApi";

import { APP_RECIPES } from "@/src/router/paths";

import PopularCategory from "@/src/components/PopularCategory";
import SectionTitle from "@/src/components/SectionTitle";

export default {
  name: "PopularCategories",
  components: { PopularCategory, SectionTitle },
  setup() {
    // const store = useStore()
    const popularCategories = ref(null);

    onBeforeMount(async () => {
      const { data } = await recipeApi.getPopularCategories();
      popularCategories.value = data;
    });

    const page = APP_RECIPES;

    // const page = computed(() => {
    //   return store.state.myKitchen.products ? APP_COOK_IT : APP_RECIPES
    // })

    return {
      popularCategories,
      page,
    };
  },
};
</script>

<style lang="scss" scoped>
.popular-categories {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.popular-category-container {
  width: 50%;
  padding: 8px;
}
</style>
