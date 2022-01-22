<template>
  <div class="popular-categories">
    <SectionTitle icon="star" title="Popularne kategorie" />
    <ul v-if="popularCategories" class="popular-categories-list">
      <li v-for="category in popularCategories" :key="category.key" class="popular-category-container">
        <PopularCategory
          :page="page"
          :category-key="category.key"
          :category-value="category.value"
          :category-group="category.categoryGroup"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'

import recipeApi from '@/api/recipeApi'

import { APP_RECIPES } from '@/router/names'

import PopularCategory from '@/components/PopularCategory.vue'
import SectionTitle from '@/components/SectionTitle.vue'

export default {
  components: { PopularCategory, SectionTitle },
  setup() {
    // const store = useStore()
    const popularCategories = ref(null)

    onBeforeMount(async () => {
      const { data } = await recipeApi.getPopularCategories()
      popularCategories.value = data
    })

    const page = APP_RECIPES

    // const page = computed(() => {
    //   return store.state.myKitchen.products ? APP_COOK_IT : APP_RECIPES
    // })

    return {
      popularCategories,
      page
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-categories {
  .popular-categories-list {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
  }

  .popular-category-container {
    width: 50%;
    padding: 8px;
  }
}
</style>
