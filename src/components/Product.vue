<template>
  <div class="product">
    <div class="product__info">
      <div class="product__name">{{ name }}</div>
      <div class="product__amount">{{ product.amount }}</div>
      <div class="product__unit">{{ unitTranslations[product.unit] ?? product.unit }}</div>
    </div>
    <div class="product__actions">
      <slot />
    </div>
  </div>
</template>

<script>
import { unitTranslations } from '@/constants'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    unitTranslations
  }),
  computed: {
    name() {
      return this.product.name ? this.product.name : this.product.baseProductName
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  border-radius: 48px;
  border: 1px solid $border;
  display: flex;
  max-width: 416px;

  &__info {
    padding: 15px;
    display: flex;
  }

  &__name {
    color: $text-primary;
  }

  &__amount {
    margin-left: 12px;
    color: $text-secondary;
  }

  &__unit {
    margin-left: 0.25rem;
    color: $text-secondary;
  }

  &__actions {
    margin-left: auto;
  }
}
</style>
