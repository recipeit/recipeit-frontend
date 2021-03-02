<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div>
        <BaseInput class="form-row" label="Nazwa" type="text" v-model="newProduct.name"></BaseInput>

        <BaseSelect
          placeholder="Gotowy produkt"
          class="form-row"
          v-model="selectedBaseProduct"
          trackBy="id"
          label="name"
          :options="baseProducts"
          :searchable="true"
        ></BaseSelect>

        <div class="form-row form-columns">
          <BaseInput class="amount-input" label="Ilość" type="text" v-model="newProduct.amount"></BaseInput>
          <BaseSelect placeholder="Jednostka" v-model="newProduct.unit" :options="units" :searchable="true">
            <template v-slot:label="{ option }">
              {{ $t(`unitsShort.${option}`) }}
            </template>
            <template v-slot:option="{ option }">
              {{ $t(`unitsShort.${option}`) }}
            </template>
          </BaseSelect>
        </div>
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
      <BaseButton class="submit-button" raised color="black" @click="editProduct">
        {{ loading ? '...edytowanie' : 'Edytuj' }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { units } from '@/constants'
import { useStore } from 'vuex'
import { computed, reactive, watch, toRefs } from 'vue'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const store = useStore()

    const data = reactive({
      loading: false,
      newProduct: JSON.parse(JSON.stringify(props.product)),
      selectedBaseProduct: null,
      baseProducts: computed(() => store.state.ingredients.baseProducts)
    })

    function editProduct() {
      store.dispatch('myKitchen/editProductFromKitchen', { id: props.product.id, product: data.newProduct }).then(() => {
        emit('close')
      })
    }

    if (data.baseProducts && props.product.baseProductId) {
      data.selectedBaseProduct = data.baseProducts.find(p => p.id === props.product.baseProductId)
    }

    watch(
      () => data.selectedBaseProduct,
      newValue => {
        if (newValue && newValue.id) {
          data.newProduct.baseProductId = newValue.id
        }
      }
    )

    return {
      units,
      ...toRefs(data),
      editProduct
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

.amount-input {
  width: 128px;
  flex: unset;
}
</style>
