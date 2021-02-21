<template>
  <div class="recipes-list">
    <div v-if="showFilterButtons" class="recipes-list__filters">
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

    <template v-if="recipes.totalCount === 0 && !recipes.fetching">
      <slot v-if="recipes.filters" name="empty-with-filters">
        Nie znaleziono przepisów dla zadanych filtrów
      </slot>

      <slot v-else name="empty-without-filters">
        <div class="recipes-list-block">
          Najpierw dodaj coś do swojej kuchni!
          <BaseButton raised color="black">Przejdź do kuchni</BaseButton>
        </div>
      </slot>
    </template>

    <template v-else>
      <div class="recipes-list__header">
        <div class="recipes-list__header__total-count">
          {{ recipes.totalCount !== null && !recipes.fetching ? $tc('shared.recipes', recipes.totalCount) : 'wczytuję' }}
        </div>
        <div v-if="showAllLink" class="recipes-list__header__show-all">
          <router-link :to="showAllLink" v-slot="{ href, navigate }" custom>
            <BaseLink :href="href" @click="navigate" color="primary" class="recipes-list__header__show-all__button">
              {{ $t('shared.seeAll') }}
            </BaseLink>
          </router-link>
        </div>
      </div>

      <ul class="recipes-list__list">
        <li class="recipes-list__list__item" v-for="recipe in recipesList" :key="recipe.id">
          <RecipeBox :recipe="recipe" />
        </li>
        <template v-if="recipes.fetching">
          <li class="recipes-list__list__item" v-for="i in 4" :key="i">O</li>
        </template>
      </ul>

      <Observer v-if="!limitedItems && recipes.hasNext" @intersect="loadNext" :options="{ rootMargin: '256px' }"></Observer>
    </template>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { RecipeList } from '@/constants'
import RecipeBox from '@/components/RecipeBox'
import FilterModal from '@/components/modals/FilterModal'
import SortModal from '@/components/modals/SortModal'
import Observer from './Observer.vue'

export default {
  components: {
    RecipeBox,
    Observer
  },
  props: {
    recipes: {
      type: RecipeList
    },
    apiEndpoint: {
      type: Function
    },
    showAllLink: {
      type: [String, Object]
    },
    limitedItems: {
      type: Number,
      default: null
    },
    showFilterButtons: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    loadNext() {
      if (!this.recipes.fetching) {
        this.$emit('load-next')
      }
    },
    openFilterModal() {
      this.$modal.show(
        markRaw(FilterModal),
        {
          options: this.recipes.filterOptions,
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
          options: this.recipes.orderMethodOptions,
          defaultSelected: this.recipes.orderMethod || this.recipes.defaultOrderMethod
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
    },
    recipesList() {
      return this.limitedItems ? this.recipes.items?.slice(0, this.limitedItems) : this.recipes.items
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

  &__header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: bold;

    &__total-count {
      color: $text-secondary;
    }

    &__show-all {
      cursor: pointer;

      &__button {
        display: flex;
        align-items: center;

        &__icon {
          font-size: 20px;
          margin-right: 4px;
        }
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
