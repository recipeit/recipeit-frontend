<template>
  <BaseIcon :class="['product-group-icon', `product-group-icon--${kebabCase(group)}`]" :icon="PRODUCT_GROUP_ICONS[group]" />
</template>

<script lang="ts">
import kebabCase from 'lodash.kebabcase'
import { defineComponent, PropType } from 'vue'

import { PRODUCT_GROUP_ICONS } from '@/constants'

import { ProductCategory } from '@/typings/productCategories'

export default defineComponent({
  props: {
    group: {
      type: String as PropType<ProductCategory>,
      required: true
    }
  },

  setup() {
    return {
      PRODUCT_GROUP_ICONS,
      kebabCase
    }
  }
})
</script>

<style lang="scss" scoped>
.product-group-icon {
  color: var(--color-text-secondary);

  @each $color, $value in $product-group-icon-color-variables {
    &--#{ $color } {
      color: $value;
    }
  }
}
</style>
