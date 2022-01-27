<template>
  <Field v-slot="{ field, errors }" type="text" name="baseProduct">
    <BaseSelect
      placeholder="Produkt"
      class="form-row"
      :autofocus="productAutofocus"
      track-by="id"
      search-by="variants"
      label="name"
      :options="groupedBaseProducts"
      :limit="1000"
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
import { Field } from 'vee-validate'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useIngredientsStore } from '@/stores/ingredients'

import ProductIcon from '@/components/ProductIcon.vue'

export default {
  components: { Field, ProductIcon },
  props: {
    productAutofocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:baseProductId', 'update:unit'],
  setup(props) {
    const { t } = useI18n()
    const ingredientsStore = useIngredientsStore()

    const groupedBaseProducts = computed(() => ingredientsStore.groupedBaseProducts)
    const units = computed(() => ingredientsStore.units)
    const unitLabelAmount = computed(() => parseFloat(props.amount) || 1)

    const unitCustomLabel = value => {
      return t(`units.${value}`, unitLabelAmount.value)
    }

    return {
      units,
      groupedBaseProducts,
      unitLabelAmount,
      unitCustomLabel
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
