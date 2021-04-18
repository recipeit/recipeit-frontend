<template>
  <div class="layout__page__content">
    <PageHeader title="Ukryte przepisy" :backButton="true" />
    <div v-if="hiddenRecipes === null">
      ...wczytuje
    </div>
    <ul v-else-if="hiddenRecipes.length > 0" class="recipes-list">
      <li v-for="recipe in hiddenRecipes" :key="recipe.id" class="recipes-list-item">
        <HiddenRecipe :recipe="recipe" @unhide="unhideRecipe(recipe.id)" />
      </li>
    </ul>
    <div v-else>
      Nie ukryłeś jeszcze żadnego przepisu
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import HiddenRecipe from '@/components/HiddenRecipe'
import userApi from '@/api/userApi'

export default {
  components: {
    PageHeader,
    HiddenRecipe
  },
  data: () => ({
    hiddenRecipes: null
  }),
  methods: {
    unhideRecipe(id) {
      this.$store.dispatch('user/changeRecipeVisibility', { recipeId: id, visible: true }).then(() => {
        const index = this.hiddenRecipes.findIndex(v => v.id === id)
        this.hiddenRecipes.splice(index, 1)
      })
    }
  },
  beforeMount() {
    userApi.getHiddenRecipes().then(({ data }) => {
      this.hiddenRecipes = data.recipes || []
    })
  }
}
</script>

<style lang="scss" scoped>
.recipes-list-item {
  & + & {
    margin-top: 1rem;
  }
}
</style>
