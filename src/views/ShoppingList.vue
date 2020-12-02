<template>
  <div class="layout__page__content">
    <h1>Lista zakupów</h1>
    <ul class="product-list">
      <li class="product-list__item" v-for="product in products" :key="product.id">
        <ShoppingListProduct :product="product" />
      </li>
    </ul>

    <div class="floating-action-button-container">
      <BaseButton raised color="black">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semiBold" />
        Dodaj produkt
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ShoppingListProduct from '@/components/ShoppingListProduct'

export default {
  name: 'ShoppingList',
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

.floating-action-button-container {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.floating-action-button {
  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}
</style>
