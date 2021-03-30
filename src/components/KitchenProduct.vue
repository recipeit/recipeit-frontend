<template>
  <Product :product="product" @click="openEditModal">
    <div class="actions" @click.stop>
      <BaseLink color="red" class="action action--remove" @click="deleteProduct">
        <BaseIcon icon="trash" weight="semi-bold" />
      </BaseLink>
      <BaseLink color="text-secondary" class="action action--decrement" @click="decreaseAmount">
        <BaseIcon icon="minus" weight="semi-bold" />
      </BaseLink>
      <BaseLink color="text-secondary" class="action action--increment" @click="increaseAmount">
        <BaseIcon icon="plus" weight="semi-bold" />
      </BaseLink>
    </div>
  </Product>
</template>

<script>
import { markRaw } from 'vue'
import Product from '@/components/Product'
import EditKitchenProductModal from './modals/EditKitchenProductModal'
import myKitchenApi from '@/api/myKitchenApi'

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
    async openEditModal() {
      let expirationDates
      try {
        const { data } = await myKitchenApi.getProductExpirationDates(this.product.id)
        if (data) {
          expirationDates = data
        }
      } catch (e) {
        console.log(e)
      }
      // myKitchenApi.getProductExpirationDates(this.productId).then(response => {
      //   this.$emit('update:modelValue', response.data)
      // })
      this.$modal.show(
        markRaw(EditKitchenProductModal),
        {
          product: this.product,
          expirationDates: expirationDates
        },
        {
          product: this.product
        }
      )
    },
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
  // padding-right: 15px;
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
