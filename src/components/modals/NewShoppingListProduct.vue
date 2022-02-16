<template>
  <SheetModalContent class="new-shopping-list-product-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit="onSubmit($event)">
        <ProductModalForm :amount="values.amount" :product-autofocus="true" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="newProduct.name"/> -->
      </form>
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
import { useForm } from 'vee-validate'
import { defineComponent, reactive, toRefs } from 'vue'
import { object as yupObject, number as yupNumber, string as yupString } from 'yup'

import { getUniqueId } from '@/functions/uniqueId'

import { useShoppingListStore } from '@/stores/shoppingList'

import { BaseProductEntity } from '@/typings/entities'
import { ProductForm } from '@/typings/forms'

import ProductModalForm from '@/components/ProductModalForm.vue'

export default defineComponent({
  components: { ProductModalForm },

  emits: ['close'],

  setup(_, { emit }) {
    // usings
    const shoppingListStore = useShoppingListStore()

    const { handleSubmit, values } = useForm<ProductForm>({
      validationSchema: yupObject().shape({
        baseProduct: yupObject().required('REQUIRED').typeError('REQUIRED'),
        amount: yupNumber()
          .typeError('Niepoprawna liczba')
          .transform((cv, ov) => {
            return ov === '' ? undefined : cv
          })
          .positive('Ilość musi być większa od 0')
          .nullable(),
        unit: yupString().nullable()
      }),
      initialValues: {
        baseProduct: null,
        amount: null,
        unit: null
      }
    })

    // consts
    const formID = 'form-' + getUniqueId()

    // data
    const data = reactive({
      sending: false
    })

    // methods
    const onSubmit = handleSubmit(({ baseProduct, amount, unit }) => {
      data.sending = true

      const { id: baseProductId } = baseProduct as BaseProductEntity

      const requestData = {
        baseProductId,
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
    })

    return {
      // consts
      formID,
      // data
      ...toRefs(data),
      values,
      // methods
      onSubmit
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
