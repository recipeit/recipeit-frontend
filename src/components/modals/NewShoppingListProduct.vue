<template>
  <SheetModalContent class="new-shopping-list-product-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" v-slot="{ values }" :validation-schema="schema" @submit="addProduct($event)">
        <ProductModalForm :amount="values.amount" :product-autofocus="true" />
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

<script lang="ts">
import { Form } from 'vee-validate'
import { defineComponent, reactive, toRefs } from 'vue'
import * as Yup from 'yup'

import { getUniqueId } from '@/functions/uniqueId'

import { useShoppingListStore } from '@/stores/shoppingList'

import ProductModalForm from '@/components/ProductModalForm.vue'

export default defineComponent({
  components: { Form, ProductModalForm },

  emits: ['close'],

  setup(_, { emit }) {
    // usings
    const shoppingListStore = useShoppingListStore()

    // consts
    const formID = 'form-' + getUniqueId()

    // data
    const data = reactive({
      sending: false
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
        baseProductId: baseProduct.id,
        amount: amount || undefined,
        unit
      }

      shoppingListStore
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
.new-shopping-list-product-modal {
  .submit-button {
    width: 100%;

    &__icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
}
</style>
