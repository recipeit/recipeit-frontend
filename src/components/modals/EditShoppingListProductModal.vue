<template>
  <SheetModalContent class="edit-shopping-list-product-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit="onSubmit($event)">
        <ProductModalForm :amount="values.amount" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="editedProduct.name"/> -->
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')"> Anuluj </BaseButton>
      <BaseButton class="submit-button" raised color="primary" type="submit" :form="formID" :loading="sending"> Edytuj </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { useForm } from 'vee-validate'
import { defineComponent, ref } from 'vue'
import { object as yupObject, number as yupNumber, string as yupString } from 'yup'

import uniqueID from '@/functions/uniqueID'

import { useIngredientsStore } from '@/stores/ingredients'
import { useShoppingListStore } from '@/stores/shoppingList'

import { BaseProductEntity } from '@/typings/entities'
import { ProductForm } from '@/typings/forms'

import ProductModalForm from '@/components/ProductModalForm.vue'

export default defineComponent({
  components: { ProductModalForm },

  props: {
    product: {
      type: Object,
      required: true
    },
    expirationDates: [Array, null]
  },

  emits: ['close'],

  setup(props, { emit }) {
    // usings
    const ingredientsStore = useIngredientsStore()
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
        baseProduct: props.product.baseProductId ? ingredientsStore.baseProducts?.find(p => p.id === props.product.baseProductId) : null,
        amount: props.product.amount,
        unit: props.product.unit
      }
    })

    // consts
    const formID = 'form-' + uniqueID().getID()

    // data
    const sending = ref(false)

    // methods
    const onSubmit = handleSubmit(({ baseProduct, amount, unit }) => {
      sending.value = true

      const { id: baseProductId } = baseProduct as BaseProductEntity

      const requestData = {
        id: props.product.id,
        baseProductId,
        amount: amount || undefined,
        unit
      }

      shoppingListStore
        .editProductFromShoppingList(requestData)
        .then(() => {
          emit('close')
        })
        .finally(() => {
          sending.value = false
        })
    })

    return {
      // consts
      formID,
      // data
      values,
      sending,
      // methods
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.edit-shopping-list-product-modal {
  .submit-button {
    width: 100%;
  }
}
</style>
