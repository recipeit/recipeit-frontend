<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" @submit="addProduct($event)" :validation-schema="schema" v-slot="{ values }">
        <ProductModalForm :productAutofocus="true" :amount="values.amount" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="newProduct.name"/> -->
        <ExpirationDatesFormSection v-model="expirationDatesForm" />
      </Form>
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
import * as Yup from 'yup'
import { Form } from 'vee-validate'
import uniqueID from '@/functions/uniqueID'
import ExpirationDatesFormSection from './ExpirationDatesFormSection'
import ProductModalForm from '@/components/ProductModalForm'

export default {
  emits: ['close'],
  components: { Form, ExpirationDatesFormSection, ProductModalForm },
  data: component => ({
    loading: false,
    newProduct: component.emptyProduct(),
    formID: 'form-' + uniqueID().getID(),
    expirationDatesForm: [],
    schema: Yup.object().shape({
      baseProduct: Yup.object()
        .required('REQUIRED')
        .typeError('REQUIRED'),
      amount: Yup.number()
        .typeError('Niepoprawna liczba')
        .transform((cv, ov) => {
          return ov === '' ? undefined : cv
        })
        .positive('Ilość musi być większa od 0')
        .nullable(),
      unit: Yup.object().nullable()
    })
  }),
  methods: {
    emptyProduct() {
      return {
        name: '',
        amount: null,
        baseProductId: null,
        unit: null
      }
    },
    addProduct(values) {
      const { baseProduct, amount, unit } = values
      const requestData = {
        product: {
          baseProductId: baseProduct.id,
          amount,
          unit
        },
        expirationDates: this.expirationDatesForm
      }

      this.$store.dispatch('myKitchen/addProduct', requestData).then(() => {
        this.$emit('close')
        this.newProduct = this.emptyProduct()
        this.expirationDates = []
        this.selectedBaseProduct = null
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
</style>
