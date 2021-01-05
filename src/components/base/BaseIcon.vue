<template>
  <div class="icon-wrapper" v-if="iconObject">
    <svg version="1.1" :viewBox="iconObject.viewBox" :innerHTML="iconObject.content"></svg>
  </div>
</template>

<script>
import * as iconsRegular from './icons/regular'
import * as iconsSemiBold from './icons/semiBold'
import * as iconsBold from './icons/bold'

export default {
  props: {
    icon: {
      type: [String, Object],
      required: true
    },
    weight: {
      type: String,
      default: 'regular'
    }
  },
  computed: {
    iconObject() {
      if (typeof this.icon === 'string') {
        switch (this.weight) {
          case 'regular':
            return iconsRegular[this.icon]
          case 'semiBold':
            return iconsSemiBold[this.icon]
          case 'bold':
            return iconsBold[this.icon]
          default:
            return iconsRegular[this.icon]
        }
      } else {
        return this.icon
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: inline-flex;
}

svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
