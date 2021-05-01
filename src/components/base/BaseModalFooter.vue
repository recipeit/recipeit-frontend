<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  props: {
    sticky: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const classes = computed(() => ({
      'modal-footer': true,
      'modal-footer--sticky': props.sticky
    }))

    return {
      classes
    }
  }
}
</script>
