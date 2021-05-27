<template>
  <div>
    <SectionTitle icon="star" title="Popularne kategorie" />
    <div class="popular-categories-container">
      <ul v-if="popularCategories" class="popular-categories">
        <li v-for="category in popularCategories" :key="category.key" class="popular-category-container">
          <PopularCategory :categoryKey="category.key" :categoryValue="category.value" :categoryGroup="category.categoryGroup" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onBeforeMount } from '@vue/runtime-core'
import { ref } from 'vue'
import recipeApi from '@/api/recipeApi'
import SectionTitle from '@/components/SectionTitle'
import PopularCategory from '@/components/PopularCategory'

export default {
  components: { SectionTitle, PopularCategory },
  setup() {
    const popularCategories = ref(null)

    onBeforeMount(async () => {
      const { data } = await recipeApi.getPopularCategories()
      popularCategories.value = data
    })

    return {
      popularCategories
    }
  }
}
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
