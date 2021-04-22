<template>
  <div>
    <SectionTitle icon="star" title="Popularne kategorie" />
    <div class="popular-categories-container">
      <ul v-if="popularCategories" class="popular-categories">
        <li v-for="category in popularCategories" :key="category.key" class="popular-category-container">
          <router-link :to="{ name: 'cook-it', query: { 'filters.Category': category.key } }" class="popular-category">
            {{ $t(`recipeFilterOptions.Category.${category.value}`) }}
          </router-link>
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

export default {
  components: { SectionTitle },
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

.popular-category {
  background-color: var(--color-image-background);
  color: inherit;
  text-decoration: none;
  display: block;
  height: 100%;
  width: 100%;
  display: flex;
  padding: 16px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;
  min-height: 96px;
  font-size: 0.875rem;
}
</style>
