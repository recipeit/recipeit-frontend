<template>
  <SheetModalContent class="new-kitchen-product-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" v-slot="{ values }" :validation-schema="schema" :initial-values="initialValues" @submit="addProduct($event)">
        <ProductModalForm :amount="values.amount" :product-autofocus="true" />
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

<script lang="ts">
import { Form } from 'vee-validate'
import { defineComponent, reactive, toRefs } from 'vue'
import * as Yup from 'yup'

import uniqueID from '@/functions/uniqueID'

import { useMyKitchenStore } from '@/stores/myKitchen'

import ProductModalForm from '@/components/ProductModalForm.vue'
import ExpirationDatesFormSection from '@/components/modals/ExpirationDatesFormSection.vue'

export default defineComponent({
  components: { Form, ProductModalForm, ExpirationDatesFormSection },

  emits: ['close'],

  setup(_, { emit }) {
    // usings
    const myKitchenStore = useMyKitchenStore()

    // consts
    const formID = 'form-' + uniqueID().getID()

    const initialValues = {
      unit: 'piece'
    }

    // data
    const data = reactive({
      sending: false,
      newProduct: {
        name: '',
        amount: null,
        baseProductId: null,
        unit: null
      },
      expirationDatesForm: []
    })

    const schema = Yup.object().shape({
      baseProduct: Yup.object().required('REQUIRED').typeError('REQUIRED'),
      amount: Yup.number()
        .typeError('Niepoprawna liczba')
        .transform((cv, ov) => {
          return ov === '' ? undefined : cv
        })
        .positive('Ilość musi być większa od 0')
        .nullable(),
      unit: Yup.object().nullable()
    })

    // methods
    const addProduct = ({ baseProduct, amount, unit }) => {
      data.sending = true

      const requestData = {
        product: {
          baseProductId: baseProduct.id,
          amount: amount || undefined,
          unit
        },
        expirationDates: data.expirationDatesForm
      }

      myKitchenStore
        .addProduct(requestData)
        .then(() => {
          emit('close')
        })
        .finally(() => {
          data.sending = false
        })
    }

    return {
      // consts
      formID,
      initialValues,
      // data
      ...toRefs(data),
      schema,
      // methods
      addProduct
    }
  }
})
</script>

<style lang="scss" scoped>
.new-kitchen-product-modal {
  .submit-button {
    width: 100%;

    &__icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
}
</style>
