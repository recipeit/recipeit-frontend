<template>
  <div ref="block" class="parallax-image">
    <div ref="image" class="parallax-image-image">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  beforeMount() {
    window.addEventListener('scroll', this.scrollHandler, false)
  },

  mounted() {
    this.scrollHandler()
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.scrollHandler, false)
  },

  methods: {
    scrollHandler() {
      const parentHeight = this.$refs.block.offsetHeight
      const scrollFactor = Math.max(0, Math.min(window.pageYOffset / parentHeight, 1))
      const transformValue = (scrollFactor * parentHeight) / 2
      this.$refs.image.style.transform = `translate3d(0, ${transformValue}px ,0)`
    }
  }
})
</script>

<style lang="scss" scoped>
.parallax-image {
  position: relative;
  overflow: hidden;

  .parallax-image-image {
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;

    img {
      // TODO probably not working
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (min-width: 721px) {
      transform: none !important;
    }
  }
}
</style>
