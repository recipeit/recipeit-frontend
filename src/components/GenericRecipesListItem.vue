<template>
  <li class="recipes-list-item">
    <RecipeBox :recipe-id="recipeId" :recipe-slug="recipeSlug" :recipe-name="recipeName" :recipe-rating="recipeRating" />
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { RecipeEntity } from '@/typings/entities'

import RecipeBox from '@/components/RecipeBox.vue'

export default defineComponent({
  components: { RecipeBox },

  props: {
    recipeId: {
      type: String as PropType<RecipeEntity['id']>,
      required: true
    },
    recipeSlug: {
      type: String as PropType<RecipeEntity['slug']>,
      required: true
    },
    recipeName: {
      type: String as PropType<RecipeEntity['name']>,
      required: true
    },
    recipeRating: {
      type: Number as PropType<RecipeEntity['rating']>
    }
  }
})
</script>

<style lang="scss" scoped>
.recipes-list-item {
  box-sizing: border-box;
  cursor: pointer;
}
</style>
