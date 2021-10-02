<template>
  <SheetModalContent>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" :validation-schema="schema" :initial-values="initialValues" @submit="addProduct($event)">
        <ProductModalForm :product-autofocus="true" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="newProduct.name"/> -->
        <ExpirationDatesFormSection v-model="expirationDatesForm" />
      </Form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="primary" type="submit" :form="formID" :loading="sending">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script>
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import uniqueID from '@/functions/uniqueID'

import ProductModalForm from '@/components/ProductModalForm'
import ExpirationDatesFormSection from '@/components/modals/ExpirationDatesFormSection'

export default {
  components: { Form, ProductModalForm, ExpirationDatesFormSection },
  emits: ['close'],
  data: component => ({
    sending: false,
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
  beforeCreate() {
    this.initialValues = {
      unit: 'piece'
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
    addProduct({ baseProduct, amount, unit }) {
      this.sending = true

      const requestData = {
        product: {
          baseProductId: baseProduct.id,
          amount: amount || undefined,
          unit
        },
        expirationDates: this.expirationDatesForm
      }

      this.$store
        .dispatch('myKitchen/addProduct', requestData)
        .then(() => {
          this.$emit('close')
        })
        .finally(() => {
          this.sending = false
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
