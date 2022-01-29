<template>
  <li class="ingredient">
    <span class="ingredient-text">
      <span class="ingredient-name">{{ name }}</span>
      <template v-if="ingredient.amount && ingredient.amount !== 0">
        <span class="ingredient-amount">{{ computedAmount }}</span>
        <span class="ingredient-unit"> {{ $tc(`unitsShort.${ingredient.unit}`, unitTranslationAmount) }}</span>
      </template>
      <span v-if="ingredient.optional" class="ingredient-optional">opcjonalnie</span>
    </span>
    <div class="state-container">
      <VTooltip>
        <BaseLink v-if="ingredient.state === 'IN_KITCHEN'" tag="button" class="state state--available" @click="stateClickHandler()">
          <BaseIcon class="state-icon state-icon--small" icon="check" weight="semi-bold" />
        </BaseLink>

        <BaseButton
          v-else-if="ingredient.state === 'IN_SHOPPING_LIST' || ingredient.state === 'UNAVAILABLE'"
          class="state"
          subtle
          :color="ingredient.state === 'IN_SHOPPING_LIST' ? 'primary' : 'accent'"
          :disabled="showLoadingState"
          @click="stateClickHandler()"
        >
          <BaseIcon class="state-icon" icon="basket" />
          <BaseIcon
            class="state-icon state-icon--small state-icon--less-space"
            :icon="ingredient.state === 'IN_SHOPPING_LIST' ? 'check' : 'plus'"
            weight="semi-bold"
          />
        </BaseButton>

        <template #popper>
          {{ actionPopperContent }}
        </template>
      </VTooltip>
    </div>
  </li>
</template>

<script>
import { computed, markRaw, reactive, toRefs } from 'vue'

import { INGREDIENT_USER_STATES } from '@/configs/recipeIngredient'

import { stringifiedAmount } from '@/functions/amount'

import { useModal } from '@/plugins/global-sheet-modal'
import { useToast } from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import { useShoppingListStore } from '@/stores/shoppingList'
import { useIngredientsStore } from '@/stores/ingredients'

import Dialog from '@/components/modals/Dialog.vue'
import SelectBaseProductFromArrayModal from '@/components/modals/SelectBaseProductFromArrayModal.vue'

export default {
  props: {
    ingredient: {
      type: Object,
      required: true
    },
    amountFactor: {
      type: Number,
      default: 1
    },
    allAdding: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // usings
    const modal = useModal()
    const toast = useToast()
    const ingredientsStore = useIngredientsStore()
    const shoppingListStore = useShoppingListStore()

    // data
    const data = reactive({
      loading: false
    })

    // computed
    const name = computed(() => {
      if (props.ingredient.name) return props.ingredient.name
      return ingredientsStore.baseProducts.find(p => p.id === props.ingredient.mainBaseProductId)?.name
    })

    const computedAmount = computed(() => {
      if (!props.ingredient.amount) return null

      let amount = stringifiedAmount(props.ingredient.amount * props.amountFactor)
      if (props.ingredient.amountMax) {
        amount += ` - ${stringifiedAmount(props.ingredient.amountMax * props.amountFactor)}`
      }

      return amount
    })

    const unitTranslationAmount = computed(() => {
      const amount = props.ingredient.amountMax || props.ingredient.amount
      if (amount) {
        return amount * props.amountFactor
      }
      return 1
    })

    const showLoadingState = computed(() => {
      return data.loading || (props.allAdding && props.ingredient.state === INGREDIENT_USER_STATES.UNAVAILABLE)
    })

    const actionPopperContent = computed(() => {
      const { state } = props.ingredient

      if (state === INGREDIENT_USER_STATES.IN_KITCHEN) {
        return 'Posiadasz ten produkt w swojej kuchni'
      }
      if (state === INGREDIENT_USER_STATES.IN_SHOPPING_LIST) {
        return 'Posiadasz ten produkt na liście zakupów'
      }
      if (state === INGREDIENT_USER_STATES.UNAVAILABLE) {
        return 'Dodaj do listy zakupów'
      }
      return null
    })

    // methods
    const addSingleProductToShoppingList = async product => {
      data.loading = true

      try {
        await shoppingListStore.addProduct(product)
      } catch {
        toast.show('Nie udało się dodać produktu do listy zakupów', ToastType.ERROR)
      } finally {
        data.loading = false
      }
    }

    const addProductToShoppingList = () => {
      const ingredient = props.ingredient
      const amount = ingredient.amount ? ingredient.amount * props.amountFactor : null

      if (ingredient.baseProductIdsArray.length > 1) {
        modal.show(
          markRaw(SelectBaseProductFromArrayModal),
          {
            ids: ingredient.baseProductIdsArray
          },
          {
            close: baseProductId => {
              if (!baseProductId) return
              const { name, unit } = ingredient
              addSingleProductToShoppingList({
                name,
                amount,
                unit,
                baseProductId
              })
            }
          }
        )
      } else {
        const { name, unit, mainBaseProductId: baseProductId } = ingredient
        addSingleProductToShoppingList({ name, amount, unit, baseProductId })
      }
    }

    const stateClickHandler = () => {
      const ingredient = props.ingredient

      if ([INGREDIENT_USER_STATES.IN_KITCHEN, INGREDIENT_USER_STATES.IN_SHOPPING_LIST].includes(ingredient.state)) {
        const title =
          ingredient.state === INGREDIENT_USER_STATES.IN_KITCHEN
            ? 'Posiadasz już ten produkt'
            : 'Posiadasz już ten produkt na liście zakupów'
        const content =
          ingredient.state === INGREDIENT_USER_STATES.IN_KITCHEN
            ? 'Czy mimo to, chcesz dodać do listy zakupów?'
            : 'Czy mimo to, chcesz dodać go jeszcze raz do listy zakupów?'
        modal.show(
          markRaw(Dialog),
          {
            title,
            content,
            secondaryText: 'Nie',
            primaryText: 'Tak'
          },
          {
            close: add => {
              if (add) {
                addProductToShoppingList()
              }
            }
          }
        )
      } else if (ingredient.state === INGREDIENT_USER_STATES.UNAVAILABLE) {
        addProductToShoppingList()
      }
    }

    return {
      // data
      ...toRefs(data),
      // computed
      name,
      computedAmount,
      unitTranslationAmount,
      showLoadingState,
      actionPopperContent,
      // methods
      stateClickHandler
    }
  }
}
</script>

<style lang="scss" scoped>
.ingredient {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 4px 0;

  &-amount {
    margin-right: 0.25rem;
  }

  &-unit {
    &:not(:last-child) {
      margin-right: 0.75rem;
    }
  }

  &-amount,
  &-unit {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: bold;
  }

  &-optional {
    color: var(--color-text-secondary);
    font-size: 0.625rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  &-text {
    flex: 1;
  }

  &-name {
    margin-right: 0.75rem;
  }

  .state-container {
    min-width: 64px;
    display: flex;
    justify-content: flex-end;
    line-height: 1;
    margin-right: -4px;
  }

  .state {
    display: flex;
    align-items: center;
    min-height: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50px;
    padding: 4px 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    justify-content: center;

    &--available {
      padding: 4px;
      color: var(--color-button-subtle-primary-color);

      @include cursor-only {
        &:hover,
        &:focus {
          background-color: var(--color-button-subtle-primary-background-hover);
        }
      }
    }

    &-icon {
      font-size: 24px;

      &--less-space {
        margin-left: 2px;
      }

      &--small {
        font-size: 16px;
      }
    }
  }
}
</style>
