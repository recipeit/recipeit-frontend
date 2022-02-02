<template>
  <div v-if="iconObject" class="base-icon">
    <component :is="iconObject" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { IconWeight } from '@/typings/icons'

import icons from '@/components/base/icons'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    weight: {
      type: String as PropType<IconWeight>,
      default: 'regular'
    }
  },

  setup(props) {
    const iconObject = computed(() => {
      return icons[props.weight]?.[props.icon]
    })

    return {
      iconObject
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
