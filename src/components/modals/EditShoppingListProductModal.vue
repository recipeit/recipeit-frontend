<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit.prevent="editProduct()">
        <ProductModalForm
          v-model:baseProductId="editedProduct.baseProductId"
          v-model:amount="editedProduct.amount"
          v-model:unit="editedProduct.unit"
        ></ProductModalForm>

        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="editedProduct.name"></BaseInput> -->

        <ExpirationDatesFormSection :productId="product.id" v-model="expirationDatesForm"></ExpirationDatesFormSection>
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="contrast" @click="editProduct">
        {{ loading ? '...edytowanie' : 'Edytuj' }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { useStore } from 'vuex'
import { reactive, toRefs } from 'vue'
import ExpirationDatesFormSection from './ExpirationDatesFormSection'
import ProductModalForm from '@/components/ProductModalForm'
import uniqueID from '@/functions/uniqueID'

export default {
  components: { ExpirationDatesFormSection, ProductModalForm },
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
    const formID = 'form-' + uniqueID().getID()
    const data = reactive({
      loading: false,
      editedProduct: JSON.parse(JSON.stringify(props.product)),
      expirationDatesForm: props.expirationDates
    })

    function editProduct() {
      store
        .dispatch('myKitchen/editProductFromKitchen', {
          id: props.product.id,
          product: data.editedProduct,
          expirationDates: data.expirationDatesForm
        })
        .then(() => {
          component.emit('close')
        })
    }

    return {
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
