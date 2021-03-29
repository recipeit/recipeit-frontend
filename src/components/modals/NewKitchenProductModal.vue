<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit.prevent="addProduct()">
        <BaseSelect
          placeholder="Produkt"
          class="form-row"
          v-model="selectedBaseProduct"
          v-autofocus
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

        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="newProduct.name"></BaseInput> -->
        <!-- <ExpirationDatesFormSection v-model="expirationDates"></ExpirationDatesFormSection> -->
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="contrast" type="submit" :form="formID">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semi-bold" />
        {{ loading ? '...dodawanie' : $t('shared.addProduct') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { units } from '@/constants'
import { mapState } from 'vuex'
import uniqueID from '@/functions/uniqueID'
// import ExpirationDatesFormSection from './ExpirationDatesFormSection'

export default {
  emits: ['close'],
  // components: { ExpirationDatesFormSection },
  data: component => ({
    units: units,
    loading: false,
    newProduct: component.emptyProduct(),
    selectedBaseProduct: null,
    formID: 'form-' + uniqueID().getID()
    // expirationDates: []
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
