<template>
  <Field type="text" name="baseProduct" v-slot="{ field, errors }">
    <BaseSelect
      placeholder="Produkt"
      class="form-row"
      v-autofocus="productAutofocus"
      trackBy="id"
      label="name"
      :options="baseProducts"
      :searchable="true"
      :errors="errors"
      v-bind="field"
    />
  </Field>

  <div class="form-row form-columns">
    <Field type="text" name="amount" v-slot="{ field, errors }">
      <BaseInput class="amount-input" label="Ilość" type="text" v-bind="field" :errors="errors" />
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
        <template v-slot:label="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
        <template v-slot:option="{ option }">{{ $tc(`units.${option}`, unitLabelAmount) }}</template>
        <template v-slot:groupLabel="{ label }">{{ $t(`unitGroups.${label}`) }}</template>
      </BaseSelect>
    </Field>
  </div>
</template>

<script>
import { Field } from 'vee-validate'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { units } from '@/constants'

export default {
  emits: ['update:baseProductId', 'update:unit'],
  components: { Field },
  props: {
    productAutofocus: Boolean,
    baseProductId: [String, Number],
    amount: [String, Number],
    unit: String
  },
  setup(props) {
    const store = useStore()
    const baseProducts = computed(() => store.state.ingredients.baseProducts)

    // const localProduct = reactive({
    //   selectedBaseProduct: props.baseProductId ? baseProducts.value?.find(p => p.id === props.baseProductId) : null,
    //   amount: props.amount,
    //   unit: props.unit
    // })

    const unitLabelAmount = computed(() => parseFloat(props.amount) || 2)

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
      baseProducts,
      unitLabelAmount,
      unitCustomLabel,
      print
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
