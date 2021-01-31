<template>
  <div class="recipes-list">
    <div class="recipes-list__filters">
      <div class="recipes-list__filters__button">
        <BaseButton stroked size="small" @click="openFilterModal">
          <BaseIcon icon="filter" class="recipes-list__filters__button__icon" />
          {{ $t('shared.filter') }}
          <transition name="filters-button-count-fade">
            <span v-if="selectedFiltersCount !== 0" class="recipes-list__filters__button__count">
              {{ selectedFiltersCount }}
            </span>
          </transition>
        </BaseButton>
      </div>
      <div class="recipes-list__filters__button">
        <BaseButton stroked size="small" @click="openSortModal">
          <BaseIcon icon="sort" class="recipes-list__filters__button__icon" />
          {{ $t('shared.sort') }}
        </BaseButton>
      </div>
    </div>

    <ul class="recipes-list__list">
      <li class="recipes-list__list__item" v-for="recipe in recipes.items" :key="recipe.id">
        <RecipeBox :recipe="recipe" />
      </li>
    </ul>

    <BaseButton v-if="recipes.hasNext" @click="loadNext">Wczytaj więcej</BaseButton>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { RecipeList } from '@/constants'
import RecipeBox from '@/components/RecipeBox'
import FilterModal from '@/components/modals/FilterModal'
import SortModal from '@/components/modals/SortModal'

export default {
  components: {
    RecipeBox
  },
  props: {
    recipes: {
      type: RecipeList
    },
    apiEndpoint: {
      type: Function
    },
    filterOptions: {
      type: Object
    },
    sortingOptions: {
      type: Array
    },
    defaultSortingOption: {
      type: String
    }
  },
  methods: {
    loadNext() {
      this.$emit('load-next')
    },
    openFilterModal() {
      this.$modal.show(
        markRaw(FilterModal),
        {
          options: this.filterOptions,
          defaultSelected: this.recipes.filters
        },
        {
          close: newFilters => {
            if (newFilters) {
              this.$emit('reload', { orderMethod: this.recipes.orderMethod, filters: newFilters })
            }
          }
        }
      )
    },
    openSortModal() {
      this.$modal.show(
        markRaw(SortModal),
        {
          options: this.sortingOptions,
          defaultSelected: this.recipes.orderMethod || this.defaultSortingOption
        },
        {
          close: newSortMethod => {
            if (newSortMethod) {
              this.$emit('reload', { orderMethod: newSortMethod, filters: this.recipes.filters })
            }
          }
        }
      )
    }
  },
  computed: {
    selectedFiltersCount() {
      if (typeof this.recipes.filters === 'object' && this.recipes.filters !== null) {
        return Object.entries(this.recipes.filters)
          .map(f => f[1].length)
          .reduce((a, b) => a + b, 0)
      }
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
.recipes-list {
  display: flex;
  flex-direction: column;

  &__filters {
    margin: -8px;
    display: flex;
    margin-bottom: 8px;

    &__button {
      padding: 8px;
      flex: 1;

      button {
        width: 100%;
      }

      &__icon {
        font-size: 20px;
        color: $primary;
        margin-right: 8px;
      }

      &__count {
        $size: 1.25rem;

        min-width: $size;
        padding: 0 6px;
        height: $size;
        margin-left: 0.6rem;
        background-color: rgba($primary, 0.2);
        color: $primary;
        border-radius: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
      }
    }
  }

  &__list {
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
}
</style>
