<template>
  <div>
    <h1>Moja kuchnia</h1>
    <ul class="product-list">
      <li class="product-list__item" v-for="product in products" :key="product.id">
        <KitchenProduct :product="product" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KitchenProduct from '@/components/KitchenProduct'

export default {
  components: {
    KitchenProduct
  },
  computed: {
    ...mapState({
      products: state => state.myKitchen.products
    })
  },
  created() {
    this.$store.dispatch('myKitchen/fetchProducts')
  }
}
</script>

<style lang="scss" scoped>
.product-list {
  display: flex;
  flex-direction: column;

  &__item {
    padding: 6px 0;
  }
}
</style>
