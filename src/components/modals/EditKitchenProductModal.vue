<template>
  <SheetModalContent class="edit-kitchen-product-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit="onSubmit($event)">
        <ProductModalForm :amount="values.amount" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="editedProduct.name"/> -->
        <ExpirationDatesFormSection v-model="expirationDatesForm" :product-id="product.id" />
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')"> Anuluj </BaseButton>
      <BaseButton class="submit-button" raised color="primary" :form="formID" :loading="sending"> Edytuj </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { useForm } from 'vee-validate'
import { defineComponent, PropType, reactive, ref, toRefs } from 'vue'
import { object as yupObject, number as yupNumber, string as yupString } from 'yup'

import uniqueID from '@/functions/uniqueID'

import { useIngredientsStore } from '@/stores/ingredients'
import { useMyKitchenStore } from '@/stores/myKitchen'

import { BaseProductEntity, UserKitchenProductEntity } from '@/typings/entities'
import { DateYMDString } from '@/typings/dates'
import { ProductForm } from '@/typings/forms'

import ProductModalForm from '@/components/ProductModalForm.vue'
import ExpirationDatesFormSection from '@/components/modals/ExpirationDatesFormSection.vue'

export default defineComponent({
  components: { ProductModalForm, ExpirationDatesFormSection },

  props: {
    product: {
      type: Object as PropType<UserKitchenProductEntity>,
      required: true
    },
    expirationDates: {
      type: Array as PropType<Array<DateYMDString>>,
      default: null
    }
  },

  emits: ['close'],

  setup(props, { emit }) {
    // usings
    const ingredientsStore = useIngredientsStore()
    const myKitchenStore = useMyKitchenStore()

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
    const data = reactive({
      loading: false,
      expirationDatesForm: props.expirationDates
    })

    const sending = ref(false)

    // methods
    const onSubmit = handleSubmit(({ baseProduct, amount, unit }) => {
      sending.value = true

      const { id: baseProductId } = baseProduct as BaseProductEntity

      const requestData = {
        product: {
          id: props.product.id,
          baseProductId,
          amount: amount || undefined,
          unit
        },
        expirationDates: data.expirationDatesForm
      }

      myKitchenStore
        .editProductFromKitchen(requestData)
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
      ...toRefs(data),
      sending,
      values,
      // methods
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.edit-kitchen-product-modal {
  .submit-button {
    width: 100%;
  }
}
</style>
