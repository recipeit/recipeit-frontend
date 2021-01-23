<template>
  <Product :product="product">
    <div class="actions">
      <BaseLink color="red" class="action action--remove" @click="deleteProduct">
        <BaseIcon icon="trash" weight="semiBold" />
      </BaseLink>
      <BaseLink color="text-secondary" class="action action--decrement" @click="decreaseAmount">
        <BaseIcon icon="minus" weight="semiBold" />
      </BaseLink>
      <BaseLink color="text-secondary" class="action action--increment" @click="increaseAmount">
        <BaseIcon icon="plus" weight="semiBold" />
      </BaseLink>
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
  font-size: 1rem;
  cursor: pointer;
}

.action {
  & + & {
    margin-left: 16px;
  }

  // &--remove {
  //   color: $red;
  // }
}
</style>
