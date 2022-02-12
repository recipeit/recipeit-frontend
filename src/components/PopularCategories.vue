<template>
  <div class="popular-categories">
    <SectionTitle icon="star" title="Popularne kategorie" />
    <ul v-if="popularCategories" class="popular-categories-list">
      <li v-for="category in popularCategories" :key="category.key" class="popular-category-container">
        <PopularCategory
          :page="APP_RECIPES"
          :category-key="category.key"
          :category-value="category.value"
          :category-group="category.categoryGroup"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'

import recipeApi from '@/api/recipeApi'

import { APP_RECIPES } from '@/router/names'

import { RecipeCategoryWithGroup } from '@/typings/recipeCategories'

import PopularCategory from '@/components/PopularCategory.vue'
import SectionTitle from '@/components/SectionTitle.vue'

export default defineComponent({
  components: { PopularCategory, SectionTitle },

  setup() {
    const popularCategories = ref<Array<RecipeCategoryWithGroup>>(null)

    onBeforeMount(async () => {
      const { data } = await recipeApi.getPopularCategories()
      popularCategories.value = data
    })

    return {
      APP_RECIPES,
      popularCategories
    }
  }
})
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
