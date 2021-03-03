<template>
  <Product :product="product">
    <div class="actions">
      <!-- <div class="actions__remove" @click="deleteProduct">usuń</div>
      <div class="actions__decrement" @click="decreaseAmount">-</div>
      <div class="actions__increment" @click="increaseAmount">+</div> -->
      <a class="purchase-button" @click="$emit('purchase')">
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
    increaseAmount() {
      const amount = Math.round(this.product.amount + 1, 5)
      this.putAmountChange(amount)
    },
    decreaseAmount() {
      if (this.product.amount <= 1.0) return
      const amount = Math.round(this.product.amount - 1, 5)
      this.putAmountChange(amount)
    },
    putAmountChange(amount) {
      var product = JSON.parse(JSON.stringify(this.product))
      product.amount = amount
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
}

.purchase-button {
  width: 32px;
  height: 32px;
  border-radius: 48px;
  background-color: rgba($primary, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: -5px;
  cursor: pointer;
  @include transition((background-color));

  &:hover {
    background-color: rgba($primary, 0.2);
  }

  &:active {
    background-color: rgba($primary, 0.3);
  }
}
</style>
