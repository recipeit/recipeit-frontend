<template>
  <div :class="{ 'skeleton-box': true, 'skeleton-box--animate': animate }" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    animate: {
      type: Boolean,
      default: true
    }
  }
})
</script>

<style lang="scss" scoped>
.skeleton-box {
  position: relative;
  background-color: var(--color-image-background);
  height: 1em;
  overflow: hidden;

  // &--dark {
  //   background-color: var(--background-);
  // }

  &.skeleton-box--animate {
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(90deg, transparent, var(--color-text-secondary), transparent);
      background-size: 100vw 100vh;
      background-attachment: fixed;
      background-position-x: -100vw;
      background-repeat: no-repeat;
      animation: loading 1s infinite;
      opacity: 0.1;
    }
  }

  @keyframes loading {
    100% {
      background-position-x: 100vw;
    }
  }
}
</style>
