<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <Form :id="formID" @submit="editProduct($event)" :validation-schema="schema" :initial-values="initialValues" v-slot="{ values }">
        <ProductModalForm :amount="values.amount" />
        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="editedProduct.name"></BaseInput> -->
      </Form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="contrast" type="submit" :form="formID">
        {{ loading ? '...edytowanie' : 'Edytuj' }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import * as Yup from 'yup'
import { Form } from 'vee-validate'
import { useStore } from 'vuex'
import { computed, reactive, toRefs } from 'vue'
import ProductModalForm from '@/components/ProductModalForm'
import uniqueID from '@/functions/uniqueID'

export default {
  components: { Form, ProductModalForm },
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

    function editProduct(values) {
      const { baseProduct, amount, unit } = values
      console.log(values)
      console.log(props.product)

      store
        .dispatch('shoppingList/editProductFromShoppingList', {
          id: props.product.id,
          baseProductId: baseProduct.id,
          amount,
          unit
        })
        .then(() => {
          component.emit('close')
        })
    }

    return {
      initialValues,
      schema,
      ...toRefs(data),
      editProduct,
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
