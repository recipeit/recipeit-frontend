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
            <template v-slot:label="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
            <template v-slot:option="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
          </BaseSelect>
        </div>

        <div class="form-row">
          <div class="expiration-date-title">Daty ważności</div>
        </div>
        <div v-if="!(expirationDates && expirationDates.length === 0)" class="form-row">
          <div v-if="expirationDates === null" class="expiration-date-list">
            <BaseButton class="expiration-date-list__item" subtle color="primary" size="small" v-for="i in 3" :key="i"></BaseButton>
          </div>
          <div v-else class="expiration-date-list">
            <BaseButton
              class="expiration-date-list__item"
              subtle
              color="contrast"
              size="small"
              v-for="expirationDate in expirationDates"
              :key="expirationDate"
            >
              {{ expirationDate }}
              <BaseIcon class="expiration-date-list__item__icon" icon="close" weight="semi-bold"></BaseIcon>
            </BaseButton>
          </div>
        </div>

        <div class="form-row">
          <BaseLink tag="button" color="primary" class="add-expiration-date-button">
            <BaseIcon class="add-expiration-date-button__icon" icon="plus" weight="semi-bold"></BaseIcon>
            {{ expirationDates && expirationDates.length > 0 ? 'dodaj kolejną datę ważności' : 'dodaj datę ważności' }}
          </BaseLink>
        </div>
      </div>
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
import { units } from '@/constants'
import { useStore } from 'vuex'
import { computed, reactive, watch, toRefs } from 'vue'
import myKitchenApi from '@/api/myKitchenApi'

export default {
  emits: ['close'],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props, component) {
    const store = useStore()

    const data = reactive({
      loading: false,
      newProduct: JSON.parse(JSON.stringify(props.product)),
      selectedBaseProduct: null,
      baseProducts: computed(() => store.state.ingredients.baseProducts),
      expirationDates: null
    })

    const unitLabelAmount = computed(() => parseFloat(data.newProduct.amount) || 2)

    function editProduct() {
      store
        .dispatch('myKitchen/editProductFromKitchen', {
          id: props.product.id,
          product: data.newProduct,
          expirationDates: data.expirationDates
        })
        .then(() => {
          component.emit('close')
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

    myKitchenApi.getProductExpirationDates(props.product.id).then(response => {
      data.expirationDates = response.data
    })

    return {
      units,
      ...toRefs(data),
      unitLabelAmount,
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

.expiration-date-title {
  color: var(--color-text-secondary);
  font-size: 12px;
  // margin-bottom: -8px;
}

.add-expiration-date-button {
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;

  &__icon {
    margin-right: 4px;
  }
}

.expiration-date-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  &__item {
    font-weight: bold;
    padding: 0.625rem 1rem;
    height: 32px;

    &__icon {
      font-size: 1rem;
      margin-left: 4px;
      margin-right: -6px;
    }
  }
}
</style>
