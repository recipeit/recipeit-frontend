<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div>
        <BaseInput class="form-row" label="Nazwa" type="text" v-model="newProduct.name"></BaseInput>

        <BaseSelect
          placeholder="Gotowy produkt"
          class="form-row"
          v-model="selectedBaseProduct"
          trackBy="id"
          label="name"
          :options="baseProducts"
          :searchable="true"
        ></BaseSelect>

        <div class="form-row form-columns">
          <BaseInput class="amount-input" label="Ilość" type="text" v-model="newProduct.amount"></BaseInput>
          <BaseSelect placeholder="Jednostka" v-model="newProduct.unit" :options="units" :searchable="true">
            <template v-slot:label="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
            <template v-slot:option="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
          </BaseSelect>
        </div>
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="contrast" @click="addProduct">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semiBold" />
        {{ loading ? '...dodawanie' : $t('shared.addProduct') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { units } from '@/constants'
import { mapState } from 'vuex'

export default {
  data: component => ({
    units: units,
    loading: false,
    newProduct: component.emptyProduct(),
    selectedBaseProduct: null
  }),
  computed: {
    ...mapState({
      baseProducts: state => state.ingredients.baseProducts
    }),
    unitLabelAmount() {
      return parseFloat(this.newProduct.amount) || 2
    }
  },
  methods: {
    emptyProduct() {
      return {
        name: '',
        amount: null,
        baseProductId: null,
        unit: null
      }
    },
    addProduct() {
      this.$store.dispatch('myKitchen/addProducts', [this.newProduct]).then(() => {
        this.newProduct = this.emptyProduct()
        this.selectedBaseProduct = null
        this.$emit('close')
      })
    }
  },
  watch: {
    selectedBaseProduct(newValue) {
      if (newValue && newValue.id) {
        this.newProduct.baseProductId = newValue.id
      }
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

.amount-input {
  width: 128px;
  flex: unset;
}
</style>
