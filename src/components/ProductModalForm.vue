<template>
  <BaseSelect
    placeholder="Produkt"
    class="form-row"
    v-model="localProduct.selectedBaseProduct"
    v-autofocus="productAutofocus"
    trackBy="id"
    label="name"
    :options="baseProducts"
    :searchable="true"
  ></BaseSelect>

  <div class="form-row form-columns">
    <BaseInput class="amount-input" label="Ilość" type="text" v-model="localProduct.amount"></BaseInput>
    <BaseSelect placeholder="Jednostka" v-model="localProduct.unit" :options="units" :searchable="false">
      <template v-slot:label="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
      <template v-slot:option="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
    </BaseSelect>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { units } from '@/constants'

export default {
  emits: ['update:baseProductId', 'update:amount', 'update:unit'],
  props: {
    productAutofocus: Boolean,
    baseProductId: [String, Number],
    amount: [String, Number],
    unit: String
  },
  setup(props, component) {
    const store = useStore()
    const baseProducts = computed(() => store.state.ingredients.baseProducts)

    const localProduct = reactive({
      selectedBaseProduct: props.baseProductId ? baseProducts.value?.find(p => p.id === props.baseProductId) : null,
      amount: props.amount,
      unit: props.unit
    })

    const unitLabelAmount = computed(() => parseFloat(localProduct.amount) || 2)

    watch(
      () => localProduct.selectedBaseProduct,
      newValue => {
        if (newValue?.id) {
          component.emit('update:baseProductId', newValue.id)
        }
      }
    )

    watch(
      () => localProduct.amount,
      newValue => component.emit('update:amount', newValue)
    )

    watch(
      () => localProduct.unit,
      newValue => component.emit('update:unit', newValue)
    )

    return {
      localProduct,
      units,
      baseProducts,
      unitLabelAmount
    }
  }
}
</script>

<style lang="scss" scoped>
.amount-input {
  width: 128px;
  flex: unset;
}
</style>
