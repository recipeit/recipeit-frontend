<template>
  <div>
    <ul class="list">
      <li class="list-item" v-for="recipe in recipes" :key="recipe.id">
        <RecipeBox :recipe="recipe" />
      </li>
      <!-- <template v-if="recipes.fetching">
        <li class="recipes-list__list__item recipes-list__list__item--skeleton" v-for="i in 4" :key="i">
          <SkeletonRecipeBox />
        </li>
      </template> -->
    </ul>
  </div>
</template>

<script>
// import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox'
import RecipeBox from '@/components/RecipeBox'
import { RecipeList } from '@/constants'

export default {
  components: { RecipeBox },
  props: {
    recipes: {
      type: RecipeList
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  overflow: auto;
  padding-bottom: 16px;

  /* width */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-scrollbar-thumb);
    border-radius: 8px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-scrollbar-thumb-hover);
  }
}

.list-item {
  width: 150px;
  max-width: 40%;
  flex-shrink: 0;

  & + & {
    margin-left: 16px;
  }
}
</style>
