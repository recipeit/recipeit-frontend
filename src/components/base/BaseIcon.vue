<template>
  <div class="icon-wrapper" v-if="iconObject">
    <svg version="1.1" :viewBox="iconObject.viewBox" :innerHTML="iconObject.content"></svg>
  </div>
</template>

<script>
import * as icons from './icons'

export default {
  props: {
    icon: {
      type: [String, Object],
      required: true
    }
  },
  computed: {
    iconObject() {
      return typeof this.icon === 'string' ? icons[this.icon] : this.icon
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
