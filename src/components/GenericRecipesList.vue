<template>
  <div class="recipes-list">
    <SearchWithFilter
      v-if="showFilterButtons"
      class="recipes-list__filter"
      placeholder="Szukaj przepisu"
      :showFilterButton="true"
      :search="recipes.search"
      :fetching="recipes.fetching"
      :filters="recipes.filterOptions"
      :sortings="recipes.orderMethodOptions"
      :appliedFilters="recipes.filters"
      :appliedSorting="recipes.orderMethod"
      :defaultSorting="recipes.defaultOrderMethod"
      :filtersCount="filtersCount"
      :error="!!errors"
      @search="onSearch($event)"
    />

    <slot name="above-list" />

    <template v-if="recipes.totalCount === 0 && !recipes.fetching">
      <slot v-if="filtersCount > 0 || recipes.search" name="empty-with-filters">
        <div class="empty-list-message">
          <p class="empty-list-message-title">Nie znaleźliśmy przepisów dla użytych filtrów</p>
          <BaseButton stroked @click="clearFilters()">Wyczyść filtry</BaseButton>
        </div>
      </slot>

      <slot v-else name="empty-without-filters">
        <div class="empty-list-message">
          <p class="empty-list-message-title">Nie znaleźliśmy przepisów pasujących do Twoich produktów</p>
        </div>
      </slot>
    </template>

    <template v-else>
      <div class="recipes-list__header">
        <slot name="count" :count="recipes.totalCount" :fetching="recipes.fetching">
          <div class="recipes-list__header__total-count">
            <template v-if="recipes.totalCount !== null && !recipes.fetching">
              {{ $tc('shared.recipes', recipes.totalCount) }}
            </template>
            <template v-else-if="recipes.fetching">
              wczytuję
            </template>
          </div>
        </slot>
        <div v-if="showAllLink" class="recipes-list__header__show-all">
          <router-link :to="showAllLink" v-slot="{ href, navigate }" custom>
            <BaseLink :href="href" @click="navigate($event)" color="primary" class="recipes-list__header__show-all__button">
              {{ $t('shared.seeAll') }}
            </BaseLink>
          </router-link>
        </div>
      </div>

      <ul class="recipes-list__list">
        <GenericRecipesListItem
          v-for="recipe in recipes.items"
          :key="recipe.id"
          :recipeId="recipe.id"
          :recipeName="recipe.name"
          :recipeRating="recipe.rating"
          :recipeImageUrl="recipe.mainImageUrl"
        />
        <template v-if="recipes.fetching">
          <li class="recipes-list__list__item recipes-list__list__item--skeleton" v-for="i in 4" :key="i">
            <SkeletonRecipeBox />
          </li>
        </template>
      </ul>

      <div v-if="errors" class="recipes-errors">
        <div class="recipes-errors-message">
          <!-- {{ errors.messageId }} -->
          Wystąpił błąd podczas wczytywania
        </div>
        <BaseButton stroked @click="tryFetchOnError()">Spróbuj ponownie</BaseButton>
      </div>

      <Observer v-if="!limitedItems && recipes.hasNext && errors === null" @intersect="loadNext" :options="{ rootMargin: '256px' }" />
    </template>
  </div>
</template>

<script>
import { RecipeList } from '@/constants'
import GenericRecipesListItem from '@/components/GenericRecipesListItem'
import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox'
import SearchWithFilter from '@/components/SearchWithFilter'
import Observer from './Observer'
import { ref, watch } from '@vue/runtime-core'

export default {
  emits: ['reload', 'load-next'],
  components: {
    SearchWithFilter,
    SkeletonRecipeBox,
    GenericRecipesListItem,
    Observer
  },
  props: {
    recipes: {
      type: RecipeList
    },
    errors: {
      type: Object,
      default: null
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
  setup(props, { emit }) {
    const searchString = ref(props.recipes.search)
    const searchTimeoutCallback = ref(null)

    const loadNext = () => {
      if (!props.recipes.fetching && props.errors === null) {
        emit('load-next')
      }
    }

    const onSearch = ({ orderMethod, filters, search }) => {
      emit('reload', { orderMethod, filters, search })
    }

    const clearFilters = () => {
      emit('reload', {})
    }

    const countFilters = () => {
      let count = 0

      const { filters: appliedFilters, orderMethod: appliedSorting, defaultOrderMethod: defaultSorting } = props.recipes

      if (typeof appliedFilters === 'object' && appliedFilters !== null) {
        count += Object.entries(appliedFilters)
          .map(f => f[1].length)
          .reduce((a, b) => a + b, 0)
      }

      if (appliedSorting && appliedSorting !== defaultSorting) {
        count++
      }

      return count
    }

    const tryFetchOnError = () => {
      if (props.errors === null) return
      const { from, query } = props.errors

      if (from === 'RELOAD') {
        emit('reload-with-query', query)
      } else if (from === 'LOAD-NEXT') {
        emit('load-next')
      }
    }

    const filtersCount = ref(countFilters())

    watch(
      () => [props.recipes.filters, props.recipes.orderMethod],
      () => {
        if (!props.recipes.fetching) {
          filtersCount.value = countFilters()
        }
      }
    )

    return {
      searchString,
      searchTimeoutCallback,
      loadNext,
      tryFetchOnError,
      onSearch,
      clearFilters,
      filtersCount
    }
  }
}
</script>

<style lang="scss" scoped>
.recipes-list {
  display: flex;
  flex-direction: column;
  flex: 1;

  &__filter {
    margin-bottom: 1rem;
  }

  &__header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: bold;

    &__total-count {
      color: var(--color-text-secondary);
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    // flex-wrap: wrap;
    // max-width: 416px;
    // margin: -8px;

    @media (min-width: 721px) {
      grid-template-columns: repeat(3, 1fr);
    }

    &__item {
      // width: 50%;
      // padding: 0.5rem 0.5rem 1rem 0.5rem;
      box-sizing: border-box;
      cursor: pointer;

      &--skeleton {
        cursor: initial;
      }

      // &.full-width {
      //   width: 100%;
      // }
    }
  }
}

.empty-list-message {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  flex: 1;

  &-title {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
}

.recipes-errors {
  text-align: center;
  margin: 48px 0;

  .recipes-errors-message {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
}
</style>
