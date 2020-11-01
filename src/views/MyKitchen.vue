<template>
  <div>
    <h1>Moja kuchnia</h1>
    <ul class="product-list">
      <li class="product-list__item" v-for="product in products" :key="product.id">
        <KitchenProduct :product="product" />
      </li>
    </ul>
    <!-- <BaseButton :anchorTag="true" href="#" color="accent">Dodaj produkt</BaseButton>
    <BaseButton raised>Dodaj produkt</BaseButton> -->
    <!-- <div><BaseButton raised>Dodaj produkt</BaseButton></div>
    <div><BaseButton raised color="primary">Dodaj produkt</BaseButton></div>
    <div><BaseButton raised color="accent">Dodaj produkt</BaseButton></div>
    <div><BaseButton raised color="warn">Dodaj produkt</BaseButton></div>
    ___

    <div><BaseButton subtle>Dodaj produkt</BaseButton></div>
    <div><BaseButton subtle color="green">Dodaj produkt</BaseButton></div>
    <div><BaseButton subtle color="accent">Dodaj produkt</BaseButton></div>
    <div><BaseButton subtle color="warn">Dodaj produkt</BaseButton></div> -->

    <div class="floating-action-button-container">
      <BaseButton raised color="primary">Dodaj produkt</BaseButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KitchenProduct from '@/components/KitchenProduct'

export default {
  name: 'MyKitchen',
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
  padding: 0;
  margin: -6px 0;

  &__item {
    padding: 6px 0;
  }
}

.floating-action-button-container {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
