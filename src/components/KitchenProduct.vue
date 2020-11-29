<template>
  <Product :product="product">
    <div class="actions">
      <div class="actions__remove" @click="deleteProduct">usuń</div>
      <div class="actions__decrement" @click="decreaseQuantity">-</div>
      <div class="actions__increment" @click="increaseQuantity">+</div>
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
  },
  methods: {
    deleteProduct() {
      this.$store.dispatch('myKitchen/deleteProductFromKitchen', this.product.id)
    },
    increaseQuantity() {
      const quantity = Math.round(this.product.quantity + 1, 5)
      this.putQuantityChange(quantity)
    },
    decreaseQuantity() {
      if (this.product.quantity <= 1.0) return
      const quantity = Math.round(this.product.quantity - 1, 5)
      this.putQuantityChange(quantity)
    },
    putQuantityChange(quantity) {
      var product = JSON.parse(JSON.stringify(this.product))
      product.quantity = quantity
      this.$store.dispatch('myKitchen/editProductFromKitchen', product)
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
