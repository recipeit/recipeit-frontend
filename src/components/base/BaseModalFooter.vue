<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
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
})
</script>
