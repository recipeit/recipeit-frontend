<template>
  <Field type="text" name="baseProduct" v-slot="{ field, errors }">
    <BaseSelect
      placeholder="Produkt"
      class="form-row"
      v-autofocus="productAutofocus"
      trackBy="id"
      label="name"
      :options="baseProductsGrouped"
      :limit="25"
      :searchable="true"
      :errors="errors"
      v-bind="field"
      @click.stop
      groupLabel="groupKey"
      groupValues="groupValues"
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
    <Field type="text" name="amount" v-slot="{ field, errors }">
      <BaseInput class="amount-input" label="Ilość" type="number" v-bind="field" :errors="errors" />
    </Field>
    <Field type="text" name="unit" v-slot="{ field, errors }">
      <BaseSelect
        placeholder="Jednostka"
        :options="units"
        :searchable="true"
        :custom-label="unitCustomLabel"
        :errors="errors"
        v-bind="field"
        groupLabel="groupKey"
        groupValues="groupValues"
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
import ProductIcon from '@/components/ProductIcon'
// import { units } from '@/constants'

export default {
  emits: ['update:baseProductId', 'update:unit'],
  components: { Field, ProductIcon },
  props: {
    productAutofocus: Boolean,
    baseProductId: [String, Number],
    amount: [String, Number],
    unit: String
  },
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

    function print(test) {
      console.log(test)
    }

    return {
      // localProduct,
      units,
      baseProductsGrouped,
      unitLabelAmount,
      unitCustomLabel,
      print
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
