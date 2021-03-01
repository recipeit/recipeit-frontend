<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Edytuj produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div>
        <div class="basa-input base-input">
          <input id="x" v-model="newProduct.name" type="text" />
          <label for="x">Nazwa</label>
        </div>

        <BaseSelect
          placeholder="Gotowy produkt"
          class="basa-input"
          v-model="selectedBaseProduct"
          trackBy="id"
          label="name"
          :options="baseProducts"
          :searchable="true"
        >
        </BaseSelect>

        <div class="he">
          <div class="basa-input base-input" style="width: 128px">
            <input v-model.number="newProduct.amount" type="text" />
            <label for="x">Ilość</label>
          </div>
          <BaseSelect
            style="flex: 1"
            placeholder="Jednostka"
            class="basa-input"
            v-model="newProduct.unit"
            :options="units"
            :searchable="true"
          >
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

.basa-input {
  & + & {
    margin-top: 16px;
  }
}

.he {
  display: flex;
  margin-top: 16px;
  // align-items: center;

  .basa-input + .basa-input {
    margin-top: 0;
    margin-left: 16px;
  }
}

.base-input {
  position: relative;

  label {
    position: absolute;
    display: flex;
    top: 0;
    // height: 100%;
    align-items: center;
    user-select: none;
    font-size: 12px;
    font-weight: bold;
  }

  input {
    display: flex;
    width: 100%;
    border: none;
    border-bottom: 2px solid $border;
    height: 48px;
    padding-top: 11px;
    font-family: inherit;
    font-weight: inherit;
    font-size: 16px;
  }
}
</style>
