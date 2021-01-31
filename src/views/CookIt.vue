<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <h1>{{ $t('cookIt.title') }}</h1>

      <div class="filters">
        <div class="filters__button">
          <BaseButton stroked size="small" @click="openFilterModal">
            <BaseIcon icon="filter" class="filters__button__icon" />
            {{ $t('shared.filter') }}
            <transition name="filters-button-count-fade">
              <span v-if="selectedFiltersCount !== 0" class="filters__button__count">{{ selectedFiltersCount }}</span>
            </transition>
          </BaseButton>
        </div>
        <div class="filters__button">
          <BaseButton stroked size="small" @click="openSortModal">
            <BaseIcon icon="sort" class="filters__button__icon" />
            {{ $t('shared.sort') }}
          </BaseButton>
        </div>
      </div>

      <div v-if="availableRecipes.totalCount === 0 && !availableRecipes.fetching" class="recipes-list-block">
        Najpierw dodaj coś do swojej kuchni!
        <BaseButton raised color="black">Przejdź do kuchni</BaseButton>
      </div>
      <div v-else class="recipes-list-block">
        <div class="recipes-list-header">
          <div class="recipes-list-header__total-count">
            {{
              availableRecipes.totalCount !== null && !availableRecipes.fetching
                ? $tc('shared.recipes', availableRecipes.totalCount)
                : 'wczytuję'
            }}
          </div>
          <div class="recipes-list-header__show-all">
            <router-link :to="{ name: 'cook-it-all' }" v-slot="{ href, navigate }" custom>
              <BaseLink :href="href" @click="navigate" color="primary" class="recipes-list-header__show-all__button">
                {{ $t('shared.seeAll') }}
              </BaseLink>
            </router-link>
          </div>
        </div>
        <ul class="recipes-list">
          <li class="recipes-list__item" v-for="recipe in availableRecipes.items" :key="recipe.id">
            <RecipeBox :recipe="recipe" />
          </li>
          <template v-if="availableRecipes.fetching">
            <li class="recipes-list__item" v-for="i in 4" :key="i">O</li>
          </template>
        </ul>
        <BaseButton v-if="availableRecipes.hasNext" @click="loadNextAvailable">Wczytaj więcej</BaseButton>
      </div>

      <div class="recipes-list-block" v-if="almostAvailableRecipes.items && almostAvailableRecipes.items.length > 0">
        <div class="recipes-list-title">
          {{ $t('cookIt.buyMissingIngredient') }}
        </div>
        <div class="recipes-list-header">
          <div class="recipes-list-header__total-count">
            {{
              almostAvailableRecipes.totalCount !== null && !almostAvailableRecipes.fetching
                ? $tc('shared.recipes', almostAvailableRecipes.totalCount)
                : 'wczytuję'
            }}
          </div>
          <div class="recipes-list-header__show-all">
            <router-link :to="{ name: 'cook-it-all' }" v-slot="{ href, navigate }" custom>
              <BaseLink :href="href" @click="navigate" color="primary" class="recipes-list-header__show-all__button">
                {{ $t('shared.seeAll') }}
              </BaseLink>
            </router-link>
          </div>
        </div>
        <ul class="recipes-list">
          <li class="recipes-list__item" v-for="recipe in almostAvailableRecipes.items" :key="recipe.recipe.id">
            <!-- {{ recipe.missingIngredientsCount }} -->
            <RecipeBox :recipe="recipe.recipe" />
          </li>
          <template v-if="almostAvailableRecipes.fetching">
            <li class="recipes-list__item" v-for="i in 4" :key="i">O</li>
          </template>
        </ul>
        <BaseButton v-if="almostAvailableRecipes.hasNext" @click="loadNextAlmostAvailable">Wczytaj więcej</BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { markRaw } from 'vue'
import { recipesSortingMethods, defaultRecipesSortingMethod } from '@/constants'
import RecipeBox from '@/components/RecipeBox'
import FilterModal from '@/components/modals/FilterModal'
import SortModal from '@/components/modals/SortModal'

export default {
  name: 'CookIt',
  components: {
    RecipeBox
  },
  computed: {
    ...mapState({
      availableRecipes: state => state.recipes.availableRecipes,
      almostAvailableRecipes: state => state.recipes.almostAvailableRecipes,
      recipeFilterOptions: state => state.recipes.filterOptions
    }),
    selectedFiltersCount() {
      if (typeof this.availableRecipes.filters === 'object' && this.availableRecipes.filters !== null) {
        return Object.entries(this.availableRecipes.filters)
          .map(f => f[1].length)
          .reduce((a, b) => a + b, 0)
      }
      return 0
    }
  },
  created() {
    this.$store.dispatch('recipes/fetchRecipeFilterOptions')
    if (this.availableRecipes.items === null) {
      this.reloadAvailable()
    }
    if (this.almostAvailableRecipes.items === null) {
      this.reloadAlmostAvailable()
    }
  },
  methods: {
    reloadRecipes(orderMethod, filters) {
      this.reloadAvailable(orderMethod, filters)
      this.reloadAlmostAvailable(orderMethod, filters)
    },
    parseFilters(filters) {
      let renamedFilters = {}
      if (typeof filters === 'object' && filters !== null) {
        Object.keys(filters).forEach(group => {
          if (filters[group] && filters[group].length > 0) {
            renamedFilters[`filters.${group}`] = filters[group].join(',')
          }
        })
      }
      return renamedFilters
    },
    fetchRecipesQueryParams(orderMethod, filters) {
      return {
        pageNumber: null,
        orderMethod: orderMethod,
        ...this.parseFilters(filters)
      }
    },
    reloadAvailable(orderMethod, filters) {
      this.$store.dispatch('recipes/fetchAvailableRecipes', this.fetchRecipesQueryParams(orderMethod, filters))
    },
    reloadAlmostAvailable(orderMethod, filters) {
      this.$store.dispatch('recipes/fetchAlmostAvailableRecipes', this.fetchRecipesQueryParams(orderMethod, filters))
    },
    loadNextAvailable() {
      this.$store.dispatch(
        'recipes/fetchNextAvailableRecipes',
        this.fetchRecipesQueryParams(this.availableRecipes.orderMethod, this.availableRecipes.filters)
      )
    },
    loadNextAlmostAvailable() {
      this.$store.dispatch(
        'recipes/fetchNextAlmostAvailableRecipes',
        this.fetchRecipesQueryParams(this.availableRecipes.orderMethod, this.availableRecipes.filters)
      )
    },
    openFilterModal() {
      this.$modal.show(
        markRaw(FilterModal),
        {
          options: this.recipeFilterOptions,
          defaultSelected: this.availableRecipes.filters
        },
        {
          close: newFilters => {
            if (newFilters) {
              this.reloadRecipes(this.availableRecipes.orderMethod, newFilters)
            }
          }
        }
      )
    },
    openSortModal() {
      console.log(this.availableRecipes.orderMethod)
      console.log(defaultRecipesSortingMethod)
      this.$modal.show(
        markRaw(SortModal),
        {
          options: recipesSortingMethods,
          defaultSelected: this.availableRecipes.orderMethod || defaultRecipesSortingMethod
        },
        {
          close: newSortMethod => {
            if (newSortMethod) {
              this.reloadRecipes(newSortMethod, this.availableRecipes.filters)
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.cook-it-layout {
  display: flex;
  flex-direction: column;
}

.filters {
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

.recipes-list-title {
  font-size: 14px;
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: bold;
}

.recipes-list-header {
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

.recipes-list {
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
</style>
