<template>
  <div>
    <h1>Moja kuchnia</h1>
    <ul class="product-list">
      <li class="product-list__item" v-for="product in products" :key="product.id">
        <KitchenProduct :product="product" />
      </li>
    </ul>

    <div>
      <h3>Dodaj nowy produkt</h3>
      <div>
        <label>
          Nazwa
          <input v-model="newProduct.name" type="text" />
        </label>
      </div>
      <div>
        <label>
          Ilość
          <input v-model.number="newProduct.quantity" type="text" />
        </label>
      </div>
      <div>
        <label>
          Jednostka
          <input v-model="newProduct.unit" type="text" />
        </label>
      </div>
    </div>

    <ul>
      <li>
        <label>
          <input v-model="newProduct.templateIngredientId" type="radio" :value="null" />
          Nic
        </label>
      </li>
      <li v-for="baseIngredient in baseIngredients" :key="baseIngredient.id">
        <label>
          <input v-model="newProduct.templateIngredientId" type="radio" :value="baseIngredient.id" />
          {{ baseIngredient.name }}
        </label>
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
      <BaseButton raised color="primary" @click="addProduct">Dodaj produkt</BaseButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KitchenProduct from '@/components/KitchenProduct'

export default {
  name: 'MyKitchen',
  data() {
    return {
      newProduct: this.emptyProduct()
    }
  },
  components: {
    KitchenProduct
  },
  computed: {
    ...mapState({
      products: state => state.myKitchen.products,
      baseIngredients: state => state.ingredients.baseIngredients
    })
  },
  created() {
    this.$store.dispatch('ingredients/fetchBaseIngredients')
    this.$store.dispatch('myKitchen/fetchProducts')
  },
  methods: {
    emptyProduct() {
      return {
        name: '',
        quantity: 1,
        templateIngredientId: null,
        unit: 'Weight.Gram'
      }
    },
    addProduct() {
      this.$store.dispatch('myKitchen/addProducts', [this.newProduct]).then(() => {
        this.newProduct = this.emptyProduct()
      })
    }
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
