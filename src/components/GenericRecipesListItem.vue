<template>
  <li class="recipes-list-item">
    <RecipeBox :recipeId="recipeId" :recipeName="recipeName" :recipeRating="recipeRating" :recipeImageUrl="recipeImageUrl" />
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
    recipeName: {
      type: String,
      required: true
    },
    recipeRating: {
      type: Number
    },
    recipeImageUrl: {
      type: String,
      required: true
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
