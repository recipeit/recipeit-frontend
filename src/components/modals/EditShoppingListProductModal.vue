<template>
  <SheetModalContent>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" :validation-schema="schema" :initial-values="initialValues" @submit="editProduct($event)">
        <ProductModalForm />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="editedProduct.name"/> -->
      </Form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="primary" type="submit" :form="formID" :loading="sending">
        {{ 'Edytuj' }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script>
import { Form } from 'vee-validate'
import { computed, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import * as Yup from 'yup'

import uniqueID from '@/functions/uniqueID'

import ProductModalForm from '@/components/ProductModalForm.vue'

export default {
  components: { Form, ProductModalForm },
  props: {
    product: {
      type: Object,
      required: true
    },
    expirationDates: [Array, null]
  },
  emits: ['close'],
  setup(props, component) {
    const store = useStore()
    const baseProducts = computed(() => store.state.ingredients.baseProducts)

    const formID = 'form-' + uniqueID().getID()
    const data = reactive({
      loading: false
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
        baseProductId: baseProduct.id,
        amount: amount || undefined,
        unit
      }

      store
        .dispatch('shoppingList/editProductFromShoppingList', requestData)
        .then(() => {
          component.emit('close')
        })
        .finally(() => {
          sending.value = false
        })
    }

    return {
      initialValues,
      schema,
      ...toRefs(data),
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
