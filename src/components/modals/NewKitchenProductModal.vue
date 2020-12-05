<template>
  <global-sheet-modal-content>
    <div>
      <h3 style="margin-top: 0">Dodaj nowy produkt</h3>
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
      <li v-for="i in 20" :key="i">
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
    <input type="text" />
    <BaseButton class="submit-button" raised color="black" @click="addProduct">
      <BaseIcon class="submit-button__icon" icon="plus" weight="semiBold" />
      {{ loading ? '...dodawanie' : 'Dodaj produkt' }}
    </BaseButton>
  </global-sheet-modal-content>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      newProduct: this.emptyProduct()
    }
  },
  computed: {
    ...mapState({
      baseIngredients: state => state.ingredients.baseIngredients
    })
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
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-button {
  margin-top: 24px;
  width: 100%;

  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}
</style>
