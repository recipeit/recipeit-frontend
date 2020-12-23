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

      <div class="recipes-list-block">
        <div class="recipes-list-header">
          <div class="recipes-list-header__total-count">
            {{ $tc('shared.recipes', allAvailableRecipesCount) }}
          </div>
          <div class="recipes-list-header__show-all">
            <router-link :to="{ name: 'cook-it-all' }" class="recipes-list-header__show-all__button">
              <BaseIcon class="recipes-list-header__show-all__button__icon" icon="arrowRight" /> {{ $t('shared.seeAll') }}
            </router-link>
          </div>
        </div>
        <ul class="recipes-list">
          <li class="recipes-list__item" v-for="recipe in availableRecipes" :key="recipe.id">
            <RecipeBox :recipe="recipe" />
          </li>
        </ul>
      </div>

      <div class="recipes-list-block">
        <div class="recipes-list-title">
          {{ $t('cookIt.buyMissingIngredient') }}
        </div>
        <div class="recipes-list-header">
          <div class="recipes-list-header__total-count">
            {{ $tc('shared.recipes', allAlmostAvailableRecipesCount) }}
          </div>
          <div class="recipes-list-header__show-all">
            <router-link :to="{ name: 'cook-it-all' }" class="recipes-list-header__show-all__button">
              <BaseIcon class="recipes-list-header__show-all__button__icon" icon="arrowRight" /> {{ $t('shared.seeAll') }}
            </router-link>
          </div>
        </div>
        <ul class="recipes-list">
          <li class="recipes-list__item" v-for="recipe in almostAvailableRecipes" :key="recipe.recipe.id">
            {{ recipe.missingIngredientsCount }}
            <RecipeBox :recipe="recipe.recipe" />
          </li>
          <li class="recipes-list__item" v-for="recipe in almostAvailableRecipes" :key="recipe.recipe.id">
            {{ recipe.missingIngredientsCount }}
            <RecipeBox :recipe="recipe.recipe" />
          </li>
          <li class="recipes-list__item" v-for="recipe in almostAvailableRecipes" :key="recipe.recipe.id">
            {{ recipe.missingIngredientsCount }}
            <RecipeBox :recipe="recipe.recipe" />
          </li>
          <li class="recipes-list__item" v-for="recipe in almostAvailableRecipes" :key="recipe.recipe.id">
            {{ recipe.missingIngredientsCount }}
            <RecipeBox :recipe="recipe.recipe" />
          </li>
          <li class="recipes-list__item" v-for="recipe in almostAvailableRecipes" :key="recipe.recipe.id">
            {{ recipe.missingIngredientsCount }}
            <RecipeBox :recipe="recipe.recipe" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { markRaw } from 'vue'
import RecipeBox from '@/components/RecipeBox'
import FilterModal from '@/components/modals/FilterModal'
import SortModal from '@/components/modals/SortModal'

export default {
  name: 'CookIt',
  components: {
    RecipeBox
  },
  data() {
    return {
      filters: {},
      sortMethod: null
    }
  },
  computed: {
    ...mapState({
      availableRecipes: state => state.recipes.availableRecipes,
      allAvailableRecipesCount: state => state.recipes.allAvailableRecipesCount | 0,
      almostAvailableRecipes: state => state.recipes.almostAvailableRecipes,
      allAlmostAvailableRecipesCount: state => state.recipes.allAlmostAvailableRecipesCount | 0
    }),
    selectedFiltersCount() {
      console.log(Object.entries(this.filters))
      var county = Object.entries(this.filters)
        .map(f => f[1].length)
        .reduce((a, b) => a + b, 0)
      return county > 9 ? '9+' : county
    }
  },
  created() {
    this.$store.dispatch('recipes/fetchAvailableRecipes')
    this.$store.dispatch('recipes/fetchAlmostAvailableRecipes')
  },
  methods: {
    openFilterModal() {
      this.$modal.show(
        markRaw(FilterModal),
        {
          defaultSelected: this.filters
        },
        {
          close: newFilters => {
            if (newFilters) {
              this.filters = newFilters
            }
          }
        }
      )
    },
    openSortModal() {
      this.$modal.show(
        markRaw(SortModal),
        {
          defaultSelected: this.sortMethod
        },
        {
          close: newSortMethod => {
            console.log(newSortMethod)
            if (newSortMethod) {
              this.sortMethod = newSortMethod
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
      $size: 1rem;

      width: $size;
      height: $size;
      margin-left: 0.6rem;
      background-color: $primary;
      color: #fff;
      border-radius: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-weight: bold;
      font-size: 10px;
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
