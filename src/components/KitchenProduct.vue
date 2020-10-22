<template>
  <Product :product="product">
    <div class="actions">
      <div class="actions__remove">usuń</div>
      <div class="actions__decrement">-</div>
      <div class="actions__increment">+</div>
    </div>
  </Product>
</template>

<script>
import Product from '@/components/Product'

export default {
  components: {
    Product
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  height: 100%;
  align-items: center;
  padding-right: 15px;
  color: #90abb9;

  &__remove {
    color: #e13939;
  }

  div + div {
    margin-left: 16px;
  }
}
</style>
