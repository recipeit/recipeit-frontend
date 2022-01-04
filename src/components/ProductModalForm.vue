<template>
  <Field v-slot="{ field, errors }" type="text" name="baseProduct">
    <BaseSelect
      placeholder="Produkt"
      class="form-row"
      :autofocus="productAutofocus"
      track-by="id"
      search-by="variants"
      label="name"
      :options="baseProductsGrouped"
      :limit="100"
      :searchable="true"
      :errors="errors"
      v-bind="field"
      group-label="groupKey"
      group-values="groupValues"
      @click.stop
    >
      <template #groupLabel="{ label }">
        <span class="category-group">
          <ProductIcon class="category-group-icon" :group="label" />
          {{ $t(`productCategory.${label}`) }}
        </span>
      </template>
    </BaseSelect>
  </Field>

  <div class="form-row form-columns">
    <Field v-slot="{ field, errors }" type="text" name="amount">
      <BaseInput class="amount-input" label="Ilość" type="number" v-bind="field" :errors="errors" />
    </Field>
    <Field v-slot="{ field, errors }" type="text" name="unit">
      <BaseSelect
        placeholder="Jednostka"
        :options="units"
        :searchable="true"
        :custom-label="unitCustomLabel"
        :errors="errors"
        v-bind="field"
        group-label="groupKey"
        group-values="groupValues"
      >
        <template #label="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
        <template #option="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
        <template #groupLabel="{ label }">{{ $t(`unitGroups.${label}`) }}</template>
      </BaseSelect>
    </Field>
  </div>
</template>

<script>
import _ from 'lodash'
import { Field } from 'vee-validate'
import { computed } from 'vue'
import { useStore } from 'vuex'

import ProductIcon from '@/components/ProductIcon.vue'

export default {
  components: { Field, ProductIcon },
  props: {
    productAutofocus: Boolean
  },
  emits: ['update:baseProductId', 'update:unit'],
  setup(props) {
    const store = useStore()
    // const baseProducts = computed(() => store.state.ingredients.baseProducts)
    const baseProductsGrouped = computed(() =>
      _(store.state.ingredients.baseProducts)
        .groupBy(item => item.category)
        .toPairs()
        .value()
        .map(pair => ({
          groupKey: pair[0],
          groupValues: pair[1]
        }))
    )

    const units = computed(() => store.state.ingredients.units)

    // const localProduct = reactive({
    //   selectedBaseProduct: props.baseProductId ? baseProducts.value?.find(p => p.id === props.baseProductId) : null,
    //   amount: props.amount,
    //   unit: props.unit
    // })

    const unitLabelAmount = computed(() => parseFloat(props.amount) || 1)

    function unitCustomLabel(value) {
      return this.$tc(`units.${value}`, unitLabelAmount.value)
    }

    // watch(
    //   () => localProduct.selectedBaseProduct,
    //   newValue => {
    //     if (newValue?.id) {
    //       component.emit('update:baseProductId', newValue.id)
    //     }
    //   }
    // )

    // watch(
    //   () => localProduct.amount,
    //   newValue => component.emit('update:amount', newValue)
    // )

    // watch(
    //   () => localProduct.unit,
    //   newValue => component.emit('update:unit', newValue)
    // )

    // function print(test) {
    //   console.log(test)
    // }

    return {
      // localProduct,
      units,
      baseProductsGrouped,
      unitLabelAmount,
      unitCustomLabel
      // print
    }
  }
}
</script>

<style lang="scss" scoped>
.category-group {
  display: flex;
  align-items: center;
}

.category-group-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.amount-input {
  width: 128px;
  flex: unset;
}
</style>
