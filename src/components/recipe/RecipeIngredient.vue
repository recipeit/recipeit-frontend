<template>
  <li class="ingredient">
    <span class="ingredient-text">
      <span class="ingredient-name">{{ name }}</span>
      <template v-if="ingredient.amount && ingredient.amount > 0">
        <span class="ingredient-amount">{{ computedAmount }}</span>
        <span class="ingredient-unit"> {{ $tc(`unitsShort.${ingredient.unit}`, unitTranslationAmount) }}</span>
        <span v-if="ingredient.optional" class="ingredient-optional">opcjonalnie</span>
      </template>
    </span>
    <div class="state-container">
      <BaseLink tag="button" v-if="ingredient.state === 'IN_KITCHEN'" class="state state--available" @click="stateClickHandler()">
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
    </div>
  </li>
</template>

<script>
import { ToastType } from '@/plugins/toast/toastType'
import { mapState } from 'vuex'
import { markRaw } from '@vue/runtime-core'
import SelectBaseProductFromArrayModal from '@/components/modals/SelectBaseProductFromArrayModal'
import DialogVue from '../modals/Dialog.vue'

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
  data: () => ({
    loading: false
  }),
  methods: {
    addSingleProductToShoppingList(product) {
      this.loading = true

      this.$store
        .dispatch('shoppingList/addProduct', product)
        .catch(() => {
          this.$toast.show('Nie udało się dodać produktu do listy zakupów', ToastType.ERROR)
        })
        .finally(() => {
          this.loading = false
        })
    },
    addProductToShoppingList() {
      const { ingredient } = this
      const amount = ingredient.amount ? ingredient.amount * this.amountFactor : null

      if (ingredient.baseProductIdsArray.length > 1) {
        this.$modal.show(
          markRaw(SelectBaseProductFromArrayModal),
          {
            ids: ingredient.baseProductIdsArray
          },
          {
            close: baseProductId => {
              if (!baseProductId) return
              const { name, unit } = ingredient
              this.addSingleProductToShoppingList({
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
        this.addSingleProductToShoppingList({ name, amount, unit, baseProductId })
      }
    },
    stateClickHandler() {
      const { ingredient } = this

      if (ingredient.state === 'IN_KITCHEN' || ingredient.state === 'IN_SHOPPING_LIST') {
        const title = ingredient.state === 'IN_KITCHEN' ? 'Posiadasz już ten produkt' : 'Posiadasz już ten produkt na liście zakupów'
        const content =
          ingredient.state === 'IN_KITCHEN'
            ? 'Czy mimo to, chcesz dodać do listy zakupów?'
            : 'Czy mimo to, chcesz dodać go jeszcze raz do listy zakupów?'
        this.$modal.show(
          markRaw(DialogVue),
          {
            title,
            content,
            secondaryText: 'Nie',
            primaryText: 'Tak'
          },
          {
            close: add => {
              if (add) {
                this.addProductToShoppingList()
              }
            }
          }
        )
      } else if (ingredient.state === 'UNAVAILABLE') {
        this.addProductToShoppingList()
        // } else if (ingredient.baseProductIdsArray.length > 1) {
        //   this.$modal.show(
        //     markRaw(SelectBaseProductFromArrayModal),
        //     {
        //       ids: ingredient.baseProductIdsArray
        //     },
        //     {
        //       close: baseProductId => {
        //         if (!baseProductId) return
        //         const { name, unit } = ingredient
        //         this.addSingleProductToShoppingList({
        //           name,
        //           amount,
        //           unit,
        //           baseProductId
        //         })
        //       }
        //     }
        //   )
        // } else {
        //   const { name, unit, mainBaseProductId: baseProductId } = ingredient
        //   this.addSingleProductToShoppingList({ name, amount, unit, baseProductId })
      }
    }
  },
  computed: {
    ...mapState({
      baseProducts: state => state.ingredients.baseProducts
    }),
    name() {
      const { ingredient } = this
      if (ingredient.name) return ingredient.name
      return this.baseProducts.find(p => p.id === ingredient.mainBaseProductId)?.name
    },
    computedAmount() {
      if (!this.ingredient.amount) return null

      let amount = this.ingredient.amount * this.amountFactor
      if (this.ingredient.amountMax) {
        amount += ` - ${this.ingredient.amountMax * this.amountFactor}`
      }

      return amount
    },
    unitTranslationAmount() {
      const amount = this.ingredient.amountMax || this.ingredient.amount
      if (amount) {
        return amount * this.amountFactor
      }
      return 1
    },
    showLoadingState() {
      return this.loading || (this.allAdding && this.ingredient.state === 'UNAVAILABLE')
    }
  }
}
</script>

<style lang="scss" scoped>
.ingredient {
  display: flex;
  align-items: center;
  min-height: 32px;
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
    margin-right: -4px;
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
