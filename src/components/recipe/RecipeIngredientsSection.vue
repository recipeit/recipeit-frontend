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
          :disabled="localServings >= 100"
          @click="increaseServings()"
        >
          <BaseIcon icon="plus" weight="semi-bold" />
        </BaseButton>
        porcji
      </template>
    </SectionTitle>
    <div class="recipe__ingredient-groups">
      <div v-for="(list, groupName) in ingredients" :key="groupName" class="recipe__ingredient-group">
        <div v-if="groupName" class="recipe-ingredients-group-name">
          <span class="first-lowercase">{{ groupName }}</span>
        </div>
        <ul class="recipe__ingredients-list">
          <RecipeIngredient
            v-for="ingredient in list"
            :key="ingredient.id"
            :amount-factor="amountFactor"
            :ingredient="ingredient"
            :all-adding="allIngredientsAdding"
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

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'

import { IngredientUserState } from '@/configs/recipeIngredient'

import { useMyKitchenStore } from '@/stores/myKitchen'
import { useShoppingListStore } from '@/stores/shoppingList'

import { RecipeEntity } from '@/typings/entities'
import { DetailedRecipe, RecipeIngredientGroups, RecipeIngredientWithUserState } from '@/typings/recipe'

import SectionTitle from '@/components/SectionTitle.vue'
import RecipeIngredient from '@/components/recipe/RecipeIngredient.vue'

export default defineComponent({
  components: { RecipeIngredient, SectionTitle },

  props: {
    recipeId: {
      type: String as PropType<RecipeEntity['id']>,
      required: true
    },
    servings: {
      type: Number as PropType<DetailedRecipe['details']['servings']>,
      default: 1
    },
    ingredientGroups: {
      type: Object as PropType<RecipeIngredientGroups>,
      required: true
    }
  },

  setup(props) {
    const myKitchenStore = useMyKitchenStore()
    const shoppingListStore = useShoppingListStore()

    const myKitchenProducts = computed(() => myKitchenStore.products || [])
    const shoppingListProducts = computed(() => shoppingListStore.products || [])

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

    const ingredients = computed<{ [key: string]: Array<RecipeIngredientWithUserState> }>(() => {
      return Object.fromEntries(
        Object.entries(props.ingredientGroups).map(([key, value]) => [
          key,
          value.map(ingredient => {
            const { baseProductIdsArray } = ingredient
            let state: IngredientUserState

            if (!baseProductIdsArray) {
              state = IngredientUserState.None
            } else if (isInMyKitchen(baseProductIdsArray)) {
              state = IngredientUserState.InKitchen
            } else if (isInShoppingList(baseProductIdsArray)) {
              state = IngredientUserState.InShoppingList
            } else {
              state = IngredientUserState.Unavailable
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

      return Object.values(ingredients.value)
        .flatMap(value => value.map(i => i.state))
        .includes(IngredientUserState.Unavailable)
    })

    const addMissingIngredientsToShoppingList = async () => {
      allIngredientsAdding.value = true

      try {
        await shoppingListStore.addMissingIngredientsToShoppingList(props.recipeId)
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
})
</script>

<style lang="scss" scoped>
.recipe-ingredients-section {
  ::v-deep(.section-title) {
    margin: 32px 0 8px 0;
  }

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

  .recipe-ingredients-group-name {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    text-align: center;
    min-height: 2rem;
    font-weight: bold;
    gap: 1rem;

    .first-lowercase {
      &::first-letter {
        text-transform: lowercase;
      }
    }

    &:before,
    &:after {
      content: '';
      height: 1px;
      flex: 1;
      background: var(--color-border);
      min-width: 1rem;
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
}
</style>
