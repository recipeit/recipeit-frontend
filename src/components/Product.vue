<template>
  <div class="product">
    <div class="product__info">
      <div class="product__name">{{ product.name }}</div>
      <div class="product__quantity">{{ product.quantity }}</div>
    </div>
    <div class="product__actions">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
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
  border: 1px solid #e2e9ed;
  display: flex;
  max-width: 360px;

  &__info {
    padding: 15px;
    display: flex;
  }

  &__name {
    color: #000;
  }

  &__quantity {
    margin-left: 12px;
    color: #90abb9;
  }

  &__actions {
    margin-left: auto;
  }
}
</style>
