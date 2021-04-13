<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form ref="form" :id="formID" @submit="addProduct($event)" :validation-schema="schema" v-slot="{ values }">
        <ProductModalForm :productAutofocus="true" :amount="values.amount" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="newProduct.name"/> -->
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
import ProductModalForm from '@/components/ProductModalForm'

export default {
  emits: ['close'],
  components: { Form, ProductModalForm },
  data: () => ({
    loading: false,
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
  methods: {
    addProduct(values) {
      const { baseProduct, amount, unit } = values
      const requestData = {
        baseProductId: baseProduct.id,
        amount,
        unit
      }

      this.$store.dispatch('shoppingList/addProduct', requestData).then(() => {
        this.$emit('close')
        this.$refs.form.setValues({
          baseProduct: null,
          amount: null,
          unit: null
        })
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
