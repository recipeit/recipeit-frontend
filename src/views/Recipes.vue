<template>
  <div>
    <h1>Przepisy</h1>
    <ul class="recipes-list">
      <li class="recipes-list__item" v-for="recipe in recipes" :key="recipe.id">
        <RecipeBox :recipe="recipe" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RecipeBox from '@/components/RecipeBox.vue'

export default {
  components: {
    RecipeBox
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.recipes
    })
  },
  created() {
    this.$store.dispatch('recipes/fetchRecipes')
  }
}
</script>

<style lang="scss" scoped>
.recipes-list {
  display: flex;
  flex-wrap: wrap;

  &__item {
    width: 164px;
    padding: 8px;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
