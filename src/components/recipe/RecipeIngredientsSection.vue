<template>
  <div class="recipe-ingredients-section">
    <SectionTitle size="large">
      <template #title>
        Składniki dla
        <BaseButton
          class="servings-button servings-button--left"
          subtle
          color="primary"
          :disabled="localServings <= 1"
          @click="decreaseServings()"
        >
          <BaseIcon icon="minus" weight="semi-bold" />
        </BaseButton>
        <span class="servings-count">{{ localServings }}</span>
        <BaseButton
          class="servings-button servings-button--right"
          subtle
          color="primary"
          @click="increaseServings()"
          :disabled="localServings >= 100"
        >
          <BaseIcon icon="plus" weight="semi-bold" />
        </BaseButton>
        porcji
      </template>
    </SectionTitle>
    <div class="recipe__ingredient-groups">
      <div class="recipe__ingredient-group" v-for="(list, groupName) in ingredients" :key="groupName">
        <div v-if="groupName" class="recipe-ingredients-group-name">{{ groupName }}</div>
        <ul class="recipe__ingredients-list">
          <RecipeIngredient
            v-for="ingredient in list"
            :key="ingredient.id"
            :amountFactor="amountFactor"
            :ingredient="ingredient"
            :allAdding="allIngredientsAdding"
          />
        </ul>
      </div>
    </div>
    <div v-if="canAddAnythingToShoppingList" class="all-to-shopping-list-button-container">
      <BaseLink tag="button" color="primary" class="all-to-shopping-list-button" @click="addMissingIngredientsToShoppingList()">
        dodaj brakujące składniki do zakupów
      </BaseLink>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import SectionTitle from '@/components/SectionTitle'
import RecipeIngredient from '@/components/recipe/RecipeIngredient'

export default {
  components: { SectionTitle, RecipeIngredient },
  props: {
    recipeId: {
      type: String,
      required: true
    },
    servings: {
      type: Number,
      default: 1
    },
    ingredientGroups: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const myKitchenProducts = computed(() => store.state.myKitchen.products || [])
    const shoppingListProducts = computed(() => store.state.shoppingList.products || [])

    // SERVINGS
    const initialServings = props.servings || 1
    const localServings = ref(initialServings)
    const decreaseServings = () => {
      if (localServings.value > 1) {
        localServings.value -= 1
      } else {
        localServings.value = 1
      }
    }
    const increaseServings = () => {
      localServings.value += 1
    }

    // INGREDIENTS
    const allIngredientsAdding = ref(false)
    const amountFactor = computed(() => localServings.value / initialServings)

    const isInMyKitchen = baseProductIdsArray => {
      return myKitchenProducts.value.find(p => baseProductIdsArray.includes(p.baseProductId))
    }
    const isInShoppingList = baseProductIdsArray => {
      return shoppingListProducts.value.find(p => baseProductIdsArray.includes(p.baseProductId))
    }

    const ingredients = computed(() => {
      return Object.fromEntries(
        Object.keys(props.ingredientGroups).map(key => [
          key,
          props.ingredientGroups[key].map(ingredient => {
            const { baseProductIdsArray } = ingredient
            let state

            if (!baseProductIdsArray) {
              state = 'NONE'
            } else if (isInMyKitchen(baseProductIdsArray)) {
              state = 'IN_KITCHEN'
            } else if (isInShoppingList(baseProductIdsArray)) {
              state = 'IN_SHOPPING_LIST'
            } else {
              state = 'UNAVAILABLE'
            }

            return {
              ...ingredient,
              state
            }
          })
        ])
      )
    })

    const canAddAnythingToShoppingList = computed(() => {
      if (!ingredients.value) return false

      return Object.keys(ingredients.value)
        .flatMap(key => ingredients.value[key].map(i => i.state))
        .includes('UNAVAILABLE')
    })

    const addMissingIngredientsToShoppingList = async () => {
      allIngredientsAdding.value = true

      try {
        await store.dispatch('shoppingList/addMissingIngredientsToShoppingList', props.recipeId)
      } finally {
        allIngredientsAdding.value = false
      }
    }

    return {
      localServings,
      decreaseServings,
      increaseServings,
      amountFactor,
      ingredients,
      allIngredientsAdding,
      canAddAnythingToShoppingList,
      addMissingIngredientsToShoppingList
    }
  }
}
</script>

<style lang="scss" scoped>
.servings-count {
  color: var(--color-primary);
  min-width: 36px;
  padding: 0 6px;
  display: inline-block;
  text-align: center;
}

.servings-button {
  display: inline-flex;
  width: 32px;
  padding: 0;
  height: 32px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  vertical-align: middle;
  line-height: 1;

  &--left {
    margin-left: 12px;
  }

  &--right {
    margin-right: 12px;
  }
}

.recipe-ingredients-section {
  ::v-deep(.section-title) {
    margin: 32px 0 8px 0;
  }
}

.recipe-ingredients-group-name {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  min-height: 2rem;
  font-weight: bold;
  gap: 1rem;

  &:before,
  &:after {
    content: '';
    height: 1px;
    flex: 1;
    background: var(--color-border);
  }
}

.all-to-shopping-list-button-container {
  margin-top: 16px;
  text-align: right;
}

.all-to-shopping-list-button {
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
