<template>
  <BaseIcon :class="['product-group-icon', `product-group-icon--${kebabCase(group)}`]" :icon="PRODUCT_GROUP_ICONS[group]" />
</template>

<script>
import kebabCase from 'lodash.kebabcase'

import { PRODUCT_GROUP_ICONS } from '@/constants'

export default {
  props: {
    group: {
      type: String,
      required: true
    }
  },
  setup() {
    return {
      PRODUCT_GROUP_ICONS,
      kebabCase
    }
  }
}
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
