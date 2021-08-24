<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" @submit="editProduct($event)" :validation-schema="schema" :initial-values="initialValues">
        <ProductModalForm />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="editedProduct.name"/> -->
        <ExpirationDatesFormSection :productId="product.id" v-model="expirationDatesForm" />
      </Form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="primary" :form="formID" :loading="sending">
        {{ 'Edytuj' }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { Form } from 'vee-validate'
import { useStore } from 'vuex'
import { computed, reactive, ref, toRefs } from 'vue'
import ExpirationDatesFormSection from './ExpirationDatesFormSection'
import ProductModalForm from '@/components/ProductModalForm'
import uniqueID from '@/functions/uniqueID'
import * as Yup from 'yup'

export default {
  components: { Form, ExpirationDatesFormSection, ProductModalForm },
  emits: ['close'],
  props: {
    product: {
      type: Object,
      required: true
    },
    expirationDates: [Array, null]
  },
  setup(props, component) {
    const store = useStore()
    const baseProducts = computed(() => store.state.ingredients.baseProducts)

    const formID = 'form-' + uniqueID().getID()
    const data = reactive({
      loading: false,
      expirationDatesForm: props.expirationDates
    })

    const initialValues = {
      baseProduct: props.product.baseProductId ? baseProducts.value?.find(p => p.id === props.product.baseProductId) : null,
      amount: props.product.amount,
      unit: props.product.unit
    }

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

    const sending = ref(false)

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

      store
        .dispatch('myKitchen/editProductFromKitchen', requestData)
        .then(() => {
          component.emit('close')
        })
        .finally(() => {
          sending.value = false
        })
    }

    return {
      ...toRefs(data),
      initialValues,
      schema,
      editProduct,
      sending,
      formID
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
