<template>
  <li class="ingredient">
    {{ ingredient.name || ingredient.baseProduct?.name }}
    <template v-if="ingredient.amount && ingredient.amount > 0">
      <span class="ingredient-amount">{{ computedAmount }}</span>
      <span class="ingredient-unit"> {{ $tc(`unitsShort.${ingredient.unit}`, unitTranslationAmount) }}</span>
    </template>
    <div class="state-container">
      <a v-if="ingredient.state === 'IN_KITCHEN'" class="state state--available">
        <BaseIcon class="state-icon state-icon--small" icon="check" weight="semi-bold" />
      </a>

      <BaseButton
        v-else-if="ingredient.state === 'IN_SHOPPING_LIST' || ingredient.state === 'UNAVAILABLE'"
        class="state"
        subtle
        :color="ingredient.state === 'IN_SHOPPING_LIST' ? 'primary' : 'accent'"
        :loading="showLoadingState"
        @click="addProductToShoppingList(ingredient)"
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
    addProductToShoppingList(product) {
      if (this.ingredient.state !== 'UNAVAILABLE') {
        return
      }

      this.loading = true

      this.$store
        .dispatch('shoppingList/addProduct', {
          name: product.name,
          amount: product.amount,
          unit: product.unit,
          baseProductId: product.baseProductId
        })
        .catch(() => {
          this.$toast.show('Nie udało się dodać produktu do listy zakupów', ToastType.ERROR)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
    computedAmount() {
      let amount = this.ingredient.amount * this.amountFactor
      if (this.ingredient.amountMax) {
        amount += ` - ${this.ingredient.amountMax * this.amountFactor}`
      }
      return amount
    },
    unitTranslationAmount() {
      return this.ingredient.amountMax || this.ingredient.amount || 1
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
    margin-left: 0.75rem;
  }

  &-unit {
    margin-left: 0.25rem;
  }

  &-amount,
  &-unit {
    color: var(--color-text-secondary);
  }

  .state-container {
    margin-left: auto;
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
