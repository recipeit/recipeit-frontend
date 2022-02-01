<template>
  <div class="product">
    <div class="product-info">
      <div class="product-name">{{ product.baseProductName }}</div>
      <div v-if="formattedAmount" class="product-amount">
        {{ formattedAmount }} {{ $tc(`unitsShort.${product.unit || 'piece'}`, product.amount) }}
      </div>
    </div>
    <div class="product-actions">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { stringifiedAmount } from '@/functions/amount'

import { UserProductEntity } from '@/typings/entities'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<UserProductEntity>,
      required: true
    }
  },

  setup(props) {
    const formattedAmount = computed(() => {
      const { amount } = props.product
      return amount > 0 ? stringifiedAmount(amount) : null
    })

    return {
      formattedAmount
    }
  }
})
</script>

<style lang="scss" scoped>
.product {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  border-radius: 48px;
  display: flex;
  min-height: 56px;

  .product-info {
    padding: 12px 12px 12px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .product-name {
    font-weight: bold;
    color: var(--color-text-primary);
  }

  .product-amount {
    color: var(--color-text-secondary);
  }

  .product-actions {
    margin-left: auto;
  }
}
</style>
