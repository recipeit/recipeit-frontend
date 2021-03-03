<template>
  <li class="ingredient">
    {{ ingredient.name || ingredient.baseProduct?.name }}
    <template v-if="ingredient.amount > 0">
      <span class="ingredient__amount">{{ ingredient.amount }}</span>
      <span class="ingredient__unit"> {{ $tc(`unitsShort.${ingredient.unit}`, ingredient.amount) }}</span>
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
          weight="semiBold"
        />
      </a>
      <a v-else-if="isInMyKitchen" class="ingredient__action ingredient__action--available">
        <BaseIcon class="ingredient__action__icon ingredient__action__icon--small" icon="check" weight="semiBold" />
      </a>
      <a v-else class="ingredient__action ingredient__action--unavailable" @click="addProductToShoppingList(ingredient)">
        <BaseIcon class="ingredient__action__icon" icon="basket" />
        <BaseIcon
          class="ingredient__action__icon ingredient__action__icon--small ingredient__action__icon--less-space"
          icon="plus"
          weight="semiBold"
        />
      </a>
    </div>
  </li>
</template>

<script>
import { mapState } from 'vuex'
import { unitTranslations } from '@/constants'

export default {
  props: {
    ingredient: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    translations: unitTranslations,
    loading: false
  }),
  methods: {
    addProductToShoppingList(product) {
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
    ...mapState({
      myKitchenProducts: state => state.myKitchen.products || [],
      shoppingListProducts: state => state.shoppingList.products || []
    }),
    isInShoppingList() {
      return this.shoppingListProducts.find(p => p.baseProductId === this.ingredient.baseProductId)
    },
    isInMyKitchen() {
      return this.myKitchenProducts.find(p => p.baseProductId === this.ingredient.baseProductId)
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
      color: var(--color-text-secondary);
      background-color: rgba($text-secondary, 0.1);
    }

    &--available {
      color: $green;

      &:hover {
        background-color: rgba($green, 0.2);
      }
    }

    &--in-shopping-list {
      color: $green;
      background-color: rgba($green, 0.1);

      &:hover {
        background-color: rgba($green, 0.2);
      }
    }

    &--unavailable {
      color: var(--color-accent);
      background-color: rgba($blue, 0.1);

      &:hover {
        background-color: rgba($blue, 0.2);
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
