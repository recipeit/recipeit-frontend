<template>
  <div class="product">
    <div class="product__info">
      <div class="product__name">{{ product.baseProductName }}</div>
      <div class="product__subname">
        <span v-if="amount" class="product__amount">{{ amount }}</span>
        <span v-if="amount && product.unit" class="product__unit">
          {{ $tc(`unitsShort.${product.unit}`, product.amount) }}
        </span>
      </div>
    </div>
    <div class="product__actions">
      <slot />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { stringifiedAmount } from '@/functions/amount'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const amount = computed(() => {
      const { amount } = props.product
      return amount > 0 ? stringifiedAmount(amount) : null
    })

    return {
      amount
    }
  }
  // computed: {
  // name() {
  // return this.product.name ? this.product.name : this.product.baseProductName
  // }
  // }
}
</script>

<style lang="scss" scoped>
.product {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  border-radius: 48px;
  // border: 1px solid var(--color-border);
  // background: var(--color-background-flyout);
  display: flex;
  // max-width: 416px;
  min-height: 56px;

  &__info {
    padding: 12px 12px 12px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__name {
    font-weight: bold;
    color: var(--color-text-primary);
  }

  &__amount {
    // margin-left: 12px;
    color: var(--color-text-secondary);
  }

  &__unit {
    margin-left: 0.25rem;
    color: var(--color-text-secondary);
  }

  &__actions {
    margin-left: auto;
  }
}
</style>
