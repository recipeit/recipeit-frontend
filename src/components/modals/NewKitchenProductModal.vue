<template>
  <SheetModalContent class="new-kitchen-product-modal">
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
import { reactive, toRefs } from 'vue'
import * as Yup from 'yup'

import uniqueID from '@/functions/uniqueID'

import { useMyKitchenStore } from '@/stores/myKitchen'

import ProductModalForm from '@/components/ProductModalForm.vue'
import ExpirationDatesFormSection from '@/components/modals/ExpirationDatesFormSection.vue'

export default {
  components: { Form, ProductModalForm, ExpirationDatesFormSection },
  emits: ['close'],
  setup(_, { emit }) {
    const myKitchenStore = useMyKitchenStore()

    const formID = 'form-' + uniqueID().getID()
    const schema = Yup.object().shape({
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

    const initialValues = {
      unit: 'piece'
    }

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
      formID,
      schema,
      ...toRefs(data),
      initialValues,
      addProduct
    }
  }
}
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
