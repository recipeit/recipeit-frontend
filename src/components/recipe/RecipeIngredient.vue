<template>
  <li class="ingredient">
    {{ ingredient.name || ingredient.baseProduct?.name }}
    <template v-if="ingredient.amount > 0">
      <span class="ingredient__amount">{{ computedAmount }}</span>
      <span class="ingredient__unit"> {{ $tc(`unitsShort.${ingredient.unit}`, computedAmount) }}</span>
    </template>
    <div class="ingredient__action-container">
      <a v-if="loading" class="ingredient__action ingredient__action--loading">
        <BaseIcon class="ingredient__action__icon" icon="clock" />
      </a>
      <a v-else-if="isInShoppingList" class="ingredient__action ingredient__action--in-shopping-list">
        <BaseIcon class="ingredient__action__icon" icon="basket" />
        <BaseIcon
          class="ingredient__action__icon ingredient__action__icon--small ingredient__action__icon--less-space"
          icon="check"
          weight="semi-bold"
        />
      </a>
      <a v-else-if="isInMyKitchen" class="ingredient__action ingredient__action--available">
        <BaseIcon class="ingredient__action__icon ingredient__action__icon--small" icon="check" weight="semi-bold" />
      </a>
      <a v-else class="ingredient__action ingredient__action--unavailable" @click="addProductToShoppingList(ingredient)">
        <BaseIcon class="ingredient__action__icon" icon="basket" />
        <BaseIcon
          class="ingredient__action__icon ingredient__action__icon--small ingredient__action__icon--less-space"
          icon="plus"
          weight="semi-bold"
        />
      </a>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { unitTranslations } from '@/constants'

export default {
  props: {
    ingredient: {
      type: Object,
      required: true
    },
    amountFactor: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    translations: unitTranslations,
    loading: false
  }),
  methods: {
    addProductToShoppingList(product) {
      if (!this.isAuthenticated) {
        alert('Zaloguj się')
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
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    ...mapState({
      myKitchenProducts: state => state.myKitchen.products || [],
      shoppingListProducts: state => state.shoppingList.products || []
    }),
    isInShoppingList() {
      return this.shoppingListProducts.find(p => p.baseProductId === this.ingredient.baseProductId)
    },
    isInMyKitchen() {
      return this.myKitchenProducts.find(p => p.baseProductId === this.ingredient.baseProductId)
    },
    computedAmount() {
      return this.ingredient.amount * this.amountFactor
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

  &__amount {
    margin-left: 0.75rem;
  }

  &__unit {
    margin-left: 0.25rem;
  }

  &__amount,
  &__unit {
    color: var(--color-text-secondary);
  }

  &__action-container {
    margin-left: auto;
  }

  &__action {
    display: flex;
    align-items: center;
    min-height: 32px;
    min-width: 32px;
    border-radius: 50px;
    padding: 4px 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: -4px;
    justify-content: center;

    &--loading {
      color: var(--color-button-subtle-contrast-color);
      background-color: var(--color-button-subtle-contrast-background-hover);
    }

    &--available {
      color: var(--color-button-subtle-primary-color);

      &:hover {
        background-color: var(--color-button-subtle-primary-background-hover);
      }
    }

    &--in-shopping-list {
      color: var(--color-button-subtle-primary-color);
      background-color: var(--color-button-subtle-primary-background);

      &:hover {
        background-color: var(--color-button-subtle-primary-background-hover);
      }
    }

    &--unavailable {
      color: var(--color-button-subtle-accent-color);
      background-color: var(--color-button-subtle-accent-background);

      &:hover {
        background-color: var(--color-button-subtle-accent-background-hover);
      }
    }

    &--available,
    &--loading {
      padding: 4px;
    }

    &__icon {
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
