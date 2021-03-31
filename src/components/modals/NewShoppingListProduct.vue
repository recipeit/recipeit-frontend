<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <form :id="formID" @submit.prevent="addProduct()">
        <ProductModalForm
          :productAutofocus="true"
          v-model:baseProductId="newProduct.baseProductId"
          v-model:amount="newProduct.amount"
          v-model:unit="newProduct.unit"
        ></ProductModalForm>

        <!-- <BaseInput class="form-row" label="Dodatkowa nazwa" type="text" v-model="newProduct.name"></BaseInput> -->
      </form>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="contrast" type="submit" :form="formID">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semi-bold" />
        {{ loading ? '...dodawanie' : $t('shared.addProduct') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import uniqueID from '@/functions/uniqueID'
import ProductModalForm from '@/components/ProductModalForm'

export default {
  emits: ['close'],
  components: { ProductModalForm },
  data: component => ({
    loading: false,
    newProduct: component.emptyProduct(),
    formID: 'form-' + uniqueID().getID()
  }),
  methods: {
    emptyProduct() {
      return {
        name: '',
        amount: null,
        baseProductId: null,
        unit: null
      }
    },
    addProduct() {
      this.$store.dispatch('shoppingList/addProduct', this.newProduct).then(() => {
        this.$emit('close')
        this.newProduct = this.emptyProduct()
        this.selectedBaseProduct = null
      })
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
