<template>
  <Product :product="product">
    <div class="actions">
      <!-- <div class="actions__remove" @click="deleteProduct">usuń</div>
      <div class="actions__decrement" @click="decreaseQuantity">-</div>
      <div class="actions__increment" @click="increaseQuantity">+</div> -->
      <a class="purchase-button">
        <BaseIcon icon="check" weight="semiBold" />
      </a>
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
      this.$store.dispatch('shoppingList/deleteProductFromShoppingList', this.product.id)
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
      this.$store.dispatch('shoppingList/editProductFromShoppingList', product)
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
}
.purchase-button {
  width: 32px;
  height: 32px;
  border-radius: 48px;
  background-color: $primary;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: -5px;
  cursor: pointer;
}
</style>
