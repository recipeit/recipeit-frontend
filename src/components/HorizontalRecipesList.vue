<template>
  <div class="list-container">
    <ul class="list">
      <li class="list-item" v-for="recipe in recipes.items" :key="recipe.id">
        <RecipeBox :recipe="recipe" />
      </li>
      <li v-if="recipes.items && recipes.totalCount > recipes.items.length" class="list-item" @click="$emit('showAll')">
        <div class="show-all-item">
          <div class="show-all-item-sizer">
            <BaseLink tag="button" class="show-all-item-button">
              <BaseIcon icon="angle-right" class="show-all-item-button-icon" />
              Zobacz wszystkie
            </BaseLink>
          </div>
        </div>
      </li>
      <template v-if="recipes.fetching">
        <li class="recipes-list__list__item recipes-list__list__item--skeleton" v-for="i in 4" :key="i">
          <SkeletonRecipeBox />
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox'
import RecipeBox from '@/components/RecipeBox'
import { RecipeList } from '@/constants'

export default {
  emits: ['showAll'],
  components: { SkeletonRecipeBox, RecipeBox },
  props: {
    recipes: {
      type: RecipeList
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  margin: 0 -32px;
}

.list {
  display: flex;
  overflow: auto;
  padding-bottom: 16px;

  &::before,
  &::after {
    content: '';
    width: 32px;
    flex-shrink: 0;
  }

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
  max-width: calc((100% - 64px) * 0.4);
  flex-shrink: 0;

  & + & {
    margin-left: 16px;
  }
}

.show-all-item {
  display: flex;
  width: 100%;
  position: relative;

  &-sizer {
    position: absolute;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }

  &-button {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;

    &-icon {
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
      border-radius: 2.5rem;
      background-color: var(--color-image-background);
      font-size: 1.25rem;
      padding-left: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
