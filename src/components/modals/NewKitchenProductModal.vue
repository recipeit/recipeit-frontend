<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div>
        <div class="base-input">
          <input id="x" v-model="newProduct.name" type="text" />
          <label for="x">Nazwa</label>
        </div>
        <div class="base-input">
          <input v-model.number="newProduct.quantity" type="text" />
          <label for="x">Ilość</label>
        </div>
        <div class="base-input">
          <input v-model="newProduct.unit" type="text" />
          <label for="x">Jednostka</label>
        </div>
      </div>
      <!-- <div>
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
      <input type="text" /> -->
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="black" @click="addProduct">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semiBold" />
        {{ loading ? '...dodawanie' : $t('shared.addProduct') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
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
  width: 100%;

  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}

.base-input {
  position: relative;

  & + & {
    margin-top: 16px;
  }

  label {
    position: absolute;
    display: flex;
    top: 0;
    // height: 100%;
    align-items: center;
    user-select: none;
    font-size: 12px;
    font-weight: bold;
  }

  input {
    display: flex;
    width: 100%;
    border: none;
    border-bottom: 2px solid $border;
    height: 48px;
    padding-top: 11px;
    font-family: inherit;
    font-weight: inherit;
    font-size: 16px;
  }
}
</style>
