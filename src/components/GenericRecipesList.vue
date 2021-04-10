<template>
  <div class="recipes-list">
    <SearchWithFilter
      v-if="showFilterButtons"
      class="recipes-list__filter"
      placeholder="Szukaj przepisu"
      :showFilterButton="true"
      :search="recipes.search"
      :filters="recipes.filterOptions"
      :sortings="recipes.orderMethodOptions"
      :appliedFilters="recipes.filters"
      :appliedSorting="recipes.orderMethod"
      :defaultSorting="recipes.defaultOrderMethod"
      @search="onSearch($event)"
    />

    <template v-if="recipes.totalCount === 0 && !recipes.fetching">
      <slot v-if="recipes.filters" name="empty-with-filters">
        Nie znaleziono przepisów dla zadanych filtrów
      </slot>

      <slot v-else name="empty-without-filters">
        <div class="recipes-list-block">
          Najpierw dodaj coś do swojej kuchni!
          <BaseButton raised color="contrast">Przejdź do kuchni</BaseButton>
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
          <li class="recipes-list__list__item recipes-list__list__item--skeleton" v-for="i in 4" :key="i">
            <SkeletonRecipeBox />
          </li>
        </template>
      </ul>

      <Observer v-if="!limitedItems && recipes.hasNext" @intersect="loadNext" :options="{ rootMargin: '256px' }"></Observer>
    </template>
  </div>
</template>

<script>
import { RecipeList } from '@/constants'
import RecipeBox from '@/components/RecipeBox'
import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox'
import SearchWithFilter from '@/components/SearchWithFilter'
import Observer from './Observer'

export default {
  emits: ['reload', 'load-next'],
  components: {
    SearchWithFilter,
    SkeletonRecipeBox,
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
  data: component => ({
    searchString: component.recipes.search,
    searchTimeoutCallback: null
  }),
  methods: {
    loadNext() {
      if (!this.recipes.fetching) {
        this.$emit('load-next')
      }
    },
    onSearch({ orderMethod, filters, search }) {
      this.$emit('reload', { orderMethod, filters, search })
    }
  },
  computed: {
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
    display: flex;
    flex-wrap: wrap;
    max-width: 416px;
    margin: -8px;

    &__item {
      width: 50%;
      padding: 8px;
      box-sizing: border-box;
      cursor: pointer;

      &--skeleton {
        cursor: initial;
      }
    }
  }
}
</style>
