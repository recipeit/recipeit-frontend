<template>
  <div class="cook-it-layout">
    <h1>Pełna lista</h1>
    <div>Te potrawy możesz przyrządzić z tego co masz w kuchni!</div>
    <div><BaseButton @click="$router.go(-1)" stroked size="small">Wróć</BaseButton></div>

    <div class="filters">
      <div class="filters__button">
        <BaseButton stroked size="small">
          <BaseIcon icon="filter" class="filters__button__icon" />
          Filtruj
        </BaseButton>
      </div>
      <div class="filters__button">
        <BaseButton stroked size="small">
          <BaseIcon icon="sort" class="filters__button__icon" />
          Sortuj
        </BaseButton>
      </div>
    </div>

    <div class="recipes-list-block">
      <div class="recipes-list-header">
        <div class="recipes-list-header__total-count">31 przepisów</div>
      </div>
      <ul class="recipes-list">
        <li class="recipes-list__item" v-for="recipe in recipes" :key="recipe.id">
          <RecipeBox :recipe="recipe" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RecipeBox from '@/components/RecipeBox.vue'

export default {
  name: 'CookIt',
  components: {
    RecipeBox
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.availableRecipes
    })
  },
  created() {
    this.$store.dispatch('recipes/fetchAvailableRecipes')
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
