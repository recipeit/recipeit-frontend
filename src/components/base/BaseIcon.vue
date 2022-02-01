<template>
  <div v-if="iconObject" class="base-icon">
    <component :is="iconObject" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import icons from '@/components/base/icons'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      default: 'regular'
    }
  },

  computed: {
    iconObject() {
      return icons[this.weight]?.[this.icon]
    }
  }
})
</script>

<style lang="scss" scoped>
.base-icon {
  display: inline-flex;

  ::v-deep(svg) {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
}
</style>
