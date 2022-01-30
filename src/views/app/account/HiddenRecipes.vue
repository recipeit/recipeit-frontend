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

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useMeta } from 'vue-meta'

import userApi from '@/api/userApi'

import { useUserStore } from '@/stores/user'

import HiddenRecipe from '@/components/HiddenRecipe.vue'
import PageHeader from '@/components/PageHeader.vue'

export default defineComponent({
  components: {
    PageHeader,
    HiddenRecipe
  },

  setup() {
    useMeta({
      title: 'Ukryte przepisy'
    })

    // usings
    const userStore = useUserStore()

    // data
    const hiddenRecipes = ref(null)

    // methods
    const unhideRecipe = id => {
      userStore.changeRecipeVisibility({ recipeId: id, visible: true }).then(() => {
        const index = hiddenRecipes.value.findIndex(v => v.id === id)
        if (index >= 0) {
          hiddenRecipes.value.splice(index, 1)
        }
      })
    }

    // lifecycle hooks
    onBeforeMount(() => {
      userApi.getHiddenRecipes().then(({ data }) => {
        hiddenRecipes.value = data.recipes || []
      })
    })

    return {
      // data
      hiddenRecipes,
      // methods
      unhideRecipe
    }
  }
})
</script>

<style lang="scss" scoped>
.hidden-recipes {
  .recipes-list-item + .recipes-list-item {
    margin-top: 1rem;
  }
}
</style>
