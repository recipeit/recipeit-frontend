<template>
  <div class="layout__page__content">
    <h1>{{ $t('recipes.title') }}</h1>
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
  name: 'Recipes',
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
  max-width: 416px;
  margin: -8px;

  &__item {
    width: 50%;
    padding: 8px;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
