<template>
  <div>
    <h1>Lista zakupów</h1>
    <ul class="product-list">
      <li class="product-list__item" v-for="product in products" :key="product.id">
        <ShoppingListProduct :product="product" />
      </li>
    </ul>
    <BaseButton>Dodaj produkt</BaseButton>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ShoppingListProduct from '@/components/ShoppingListProduct'

export default {
  components: {
    ShoppingListProduct
  },
  computed: {
    ...mapState({
      products: state => state.shoppingList.products
    })
  },
  created() {
    this.$store.dispatch('shoppingList/fetchProducts')
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
