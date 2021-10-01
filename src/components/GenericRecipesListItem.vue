<template>
  <li class="recipes-list-item">
    <RecipeBox :recipe-id="recipeId" :recipe-slug="recipeSlug" :recipe-name="recipeName" :recipe-rating="recipeRating" />
  </li>
</template>

<script>
import RecipeBox from '@/components/RecipeBox'

export default {
  components: { RecipeBox },
  props: {
    recipeId: {
      type: String,
      required: true
    },
    recipeSlug: {
      type: String,
      required: true
    },
    recipeName: {
      type: String,
      required: true
    },
    recipeRating: {
      type: Number
    }
  }
}
</script>

<style lang="scss" scoped>
.recipes-list-item {
  box-sizing: border-box;
  cursor: pointer;
}
</style>
