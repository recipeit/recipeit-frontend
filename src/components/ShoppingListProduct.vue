<template>
  <Product :product="product" @click="openEditModal()">
    <div class="actions">
      <!-- <div class="actions__remove" @click="deleteProduct">usuń</div>
      <div class="actions__decrement" @click="decreaseAmount">-</div>
      <div class="actions__increment" @click="increaseAmount">+</div> -->
      <a class="remove-button" @click="deleteProduct()">
        <BaseIcon icon="trash" weight="semi-bold" />
      </a>
      <a class="purchase-button" @click="$emit('purchase')">
        <BaseIcon icon="check" weight="semi-bold" />
      </a>
    </div>
  </Product>
</template>

<script>
import { markRaw } from 'vue'
import Product from '@/components/Product'
import EditShoppingListProductModal from './modals/EditShoppingListProductModal'

export default {
  emits: ['purchase'],
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
    },
    async openEditModal() {
      this.$modal.show(
        markRaw(EditShoppingListProductModal),
        {
          product: this.product
        },
        {
          product: this.product
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  height: 100%;
  align-items: center;
  // padding-right: 15px;
}

.purchase-button {
  width: 32px;
  height: 32px;
  border-radius: 48px;
  background-color: var(--color-button-subtle-primary-background);
  color: var(--color-button-subtle-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: -5px;
  cursor: pointer;
  @include transition((background-color));

  &:hover {
    background-color: var(--color-button-subtle-primary-background-hover);
  }

  &:active {
    background-color: var(--color-button-subtle-primary-background-active);
  }
}

.remove-button {
  width: 32px;
  height: 32px;
  border-radius: 48px;
  background-color: var(--color-button-subtle-danger-background);
  color: var(--color-button-subtle-danger-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 8px;
  cursor: pointer;
  @include transition((background-color));

  &:hover {
    background-color: var(--color-button-subtle-danger-background-hover);
  }

  &:active {
    background-color: var(--color-button-subtle-danger-background-active);
  }
}
</style>
