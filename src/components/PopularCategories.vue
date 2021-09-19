<template>
  <div>
    <SectionTitle icon="star" title="Popularne kategorie" />
    <div class="popular-categories-container">
      <ul v-if="popularCategories" class="popular-categories">
        <li v-for="category in popularCategories" :key="category.key" class="popular-category-container">
          <PopularCategory
            :page="page"
            :categoryKey="category.key"
            :categoryValue="category.value"
            :categoryGroup="category.categoryGroup"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onBeforeMount } from '@vue/runtime-core'
import { ref } from 'vue'
import { APP_RECIPES } from '@/router/names'
import recipeApi from '@/api/recipeApi'
import SectionTitle from '@/components/SectionTitle'
import PopularCategory from '@/components/PopularCategory'
// import { useStore } from 'vuex'

export default {
  components: { SectionTitle, PopularCategory },
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
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.popular-category-container {
  width: 50%;
  padding: 8px;
}
</style>
