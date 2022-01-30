<template>
  <SheetModalContent class="edit-kitchen-product-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" :validation-schema="schema" :initial-values="initialValues" @submit="editProduct($event)">
        <ProductModalForm />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="editedProduct.name"/> -->
        <ExpirationDatesFormSection v-model="expirationDatesForm" :product-id="product.id" />
      </Form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="primary" :form="formID" :loading="sending">
        Edytuj
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { Form } from 'vee-validate'
import { computed, defineComponent, PropType, reactive, ref, toRefs } from 'vue'
import * as Yup from 'yup'

import uniqueID from '@/functions/uniqueID'

import { useIngredientsStore } from '@/stores/ingredients'
import { useMyKitchenStore } from '@/stores/myKitchen'

import ProductModalForm from '@/components/ProductModalForm.vue'
import ExpirationDatesFormSection from '@/components/modals/ExpirationDatesFormSection.vue'

export default defineComponent({
  components: { Form, ProductModalForm, ExpirationDatesFormSection },

  props: {
    product: {
      type: Object,
      required: true
    },
    expirationDates: {
      type: Array as PropType<Array<string>>,
      default: null
    }
  },

  emits: ['close'],

  setup(props, { emit }) {
    // usings
    const ingredientsStore = useIngredientsStore()
    const myKitchenStore = useMyKitchenStore()

    // computed
    const baseProducts = computed(() => ingredientsStore.baseProducts)

    // consts
    const formID = 'form-' + uniqueID().getID()

    const initialValues = {
      baseProduct: props.product.baseProductId ? baseProducts.value?.find(p => p.id === props.product.baseProductId) : null,
      amount: props.product.amount,
      unit: props.product.unit
    }

    // data
    const data = reactive({
      loading: false,
      expirationDatesForm: props.expirationDates
    })

    const sending = ref(false)

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
      unit: Yup.string().nullable()
    })

    // methods
    const editProduct = ({ baseProduct, amount, unit }) => {
      sending.value = true

      const requestData = {
        id: props.product.id,
        product: {
          baseProductId: baseProduct.id,
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
    }

    return {
      // consts
      formID,
      initialValues,
      // data
      ...toRefs(data),
      sending,
      schema,
      // methods
      editProduct
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
