<template>
  <div class="layout__page__content hidden-recipes">
    <PageHeader title="Ukryte przepisy" :back-button="true" />
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
import { useMeta } from 'vue-meta'

import userApi from '@/api/userApi'

import { useUserStore } from '@/stores/user'

import HiddenRecipe from '@/components/HiddenRecipe.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  components: {
    PageHeader,
    HiddenRecipe
  },
  setup() {
    useMeta({
      title: 'Ukryte przepisy'
    })

    const userStore = useUserStore()

    return {
      userStore
    }
  },
  data: () => ({
    hiddenRecipes: null
  }),
  beforeMount() {
    userApi.getHiddenRecipes().then(({ data }) => {
      this.hiddenRecipes = data.recipes || []
    })
  },
  methods: {
    unhideRecipe(id) {
      this.userStore.changeRecipeVisibility({ recipeId: id, visible: true }).then(() => {
        const index = this.hiddenRecipes.findIndex(v => v.id === id)
        this.hiddenRecipes.splice(index, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden-recipes {
  .recipes-list-item + .recipes-list-item {
    margin-top: 1rem;
  }
}
</style>
