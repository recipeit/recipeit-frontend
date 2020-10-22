<template>
  <div>
    <h1>Przepisy</h1>
    <ul>
      <li v-for="recipe in recipes" :key="recipe.id">{{ recipe.name }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  created() {
    this.$store.dispatch('fetchRecipes')
  },
  computed: {
    ...mapState({
      recipes: state => state.recipe.recipes
    })
  }
}
</script>

<style></style>
