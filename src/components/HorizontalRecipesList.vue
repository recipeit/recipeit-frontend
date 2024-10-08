<template>
  <div class="list-container">
    <ul class="list">
      <GenericRecipesListItem
        v-for="{ id, slug, name, rating } in items"
        :key="id"
        class="list-item"
        :recipe-id="id"
        :recipe-slug="slug || id"
        :recipe-name="name"
        :recipe-rating="rating"
      />
      <li v-if="items && recipes.totalCount > items.length" class="list-item" @click="$emit('show-all')">
        <div class="show-all-item">
          <div class="show-all-item-sizer">
            <BaseLink tag="button" class="show-all-item-button">
              <BaseIcon icon="angle-right" class="show-all-item-button-icon" />
              Zobacz wszystkie
            </BaseLink>
          </div>
        </div>
      </li>
      <template v-if="Object.values(recipes.fetchingPages).some(v => v)">
        <li v-for="i in 6" :key="i" class="list-item list-item--skeleton">
          <SkeletonRecipeBox />
        </li>
      </template>
      <slot v-else-if="recipes.items && recipes.totalCount === 0" name="empty-list" />
    </ul>
    <div v-if="errors" class="recipes-errors">
      <div class="recipes-errors-message">
        <!-- {{ errors.messageId }} -->
        Wystąpił błąd podczas wczytywania
      </div>
      <BaseButton stroked @click="tryFetchOnError()">Spróbuj ponownie</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { RecipesFilteredPageState } from '@/models/RecipesFilteredPageState'
import { RecipesPageState } from '@/models/RecipesPageState'

import GenericRecipesListItem from '@/components/GenericRecipesListItem.vue'
import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox.vue'

export default defineComponent({
  components: { GenericRecipesListItem, SkeletonRecipeBox },

  props: {
    recipes: {
      type: Object as PropType<RecipesPageState | RecipesFilteredPageState>
    },
    errors: {
      type: Object,
      default: null
    }
  },

  emits: ['show-all', 'reload-with-query'],

  setup(props, { emit }) {
    // computed
    const items = computed(() => {
      return props.recipes?.pagedItems[1] || []
    })

    // methods

    const tryFetchOnError = () => {
      if (props.errors === null) return
      const { from, query } = props.errors

      if (from === 'RELOAD') {
        emit('reload-with-query', query)
      }
    }

    return {
      // computed
      items,
      // methods
      tryFetchOnError
    }
  }
})
</script>

<style lang="scss" scoped>
.list-container {
  margin-left: -32px;
  margin-right: -32px;
  margin-bottom: 16px;

  @media (min-width: 721px) {
    margin-left: 0;
    margin-right: 0;
  }

  .list {
    display: flex;
    overflow: auto;

    @include cursor-only {
      @include scrollbar;
    }

    &::before,
    &::after {
      content: '';
      width: 32px;
      flex-shrink: 0;

      @media (min-width: 721px) {
        content: none;
      }
    }
  }

  .list-item {
    width: 150px;
    max-width: calc((100% - 64px) * 0.4);
    flex-shrink: 0;
  }

  .list-item + .list-item {
    margin-left: 16px;
  }

  .show-all-item {
    display: flex;
    width: 100%;
    position: relative;

    .show-all-item-sizer {
      position: absolute;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
    }

    .show-all-item-button {
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

      .show-all-item-button-icon {
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

  .recipes-errors {
    text-align: center;
    margin: 24px 0;

    .recipes-errors-message {
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
  }
}
</style>
