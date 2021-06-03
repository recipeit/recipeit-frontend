<template>
  <div class="parallax-image" ref="block">
    <div class="parallax-image__image" ref="image">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
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
}
</script>

<style lang="scss">
.parallax-image {
  position: relative;
  overflow: hidden;

  &__image {
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;

    img {
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
