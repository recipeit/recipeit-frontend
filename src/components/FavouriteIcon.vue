<template>
  <!-- <span v-if="isFavourite" class="favourite favourite--active" @click="$emit('removed')">
    <BaseIcon icon="heart-full" />
  </span>
  <span class="favourite" v-else @click="$emit('added')">
    <BaseIcon icon="heart" />
  </span> -->
  <BaseLink class="favourite" tag="button" :color="isFavourite ? 'red' : color" @click="onClick()">
    <BaseIcon :icon="isFavourite ? 'heart-full' : 'heart'" />
  </BaseLink>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { BaseLinkColor } from '@/typings/link'

export default defineComponent({
  props: {
    isFavourite: {
      type: Boolean,
      default: false
    },
    color: {
      type: String as PropType<BaseLinkColor>,
      default: 'text-secondary'
    }
  },

  emits: ['added', 'removed'],

  setup(props, { emit }) {
    const onClick = () => {
      if (props.isFavourite) {
        emit('removed')
      } else {
        emit('added')
      }
    }

    return {
      onClick
    }
  }
})
</script>

<style lang="scss" scoped>
.favourite {
  font-size: 1em;
  line-height: 0;
}
</style>
