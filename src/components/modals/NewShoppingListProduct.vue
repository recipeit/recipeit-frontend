<template>
  <SheetModalContent>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" ref="form" :validation-schema="schema" @submit="addProduct($event)">
        <ProductModalForm :product-autofocus="true" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="newProduct.name"/> -->
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

export default {
  components: { Form, ProductModalForm },
  emits: ['close'],
  data: () => ({
    sending: false,
    formID: 'form-' + uniqueID().getID(),
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
    this.DEFAULT_UNIT = 'piece'
  },
  methods: {
    addProduct({ baseProduct, amount, unit }) {
      this.sending = true

      const requestData = {
        baseProductId: baseProduct.id,
        amount: amount || undefined,
        unit
      }

      this.$store
        .dispatch('shoppingList/addProduct', requestData)
        .then(() => {
          this.$emit('close')
          // this.$refs.form.setValues({
          //   baseProduct: null,
          //   amount: null,
          //   unit: null
          // })
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
