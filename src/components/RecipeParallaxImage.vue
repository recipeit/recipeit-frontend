<template>
  <div ref="blockElement" class="parallax-image">
    <div ref="imageElement" class="parallax-image-image">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    // refs
    const blockElement = ref(null)
    const imageElement = ref(null)

    // internal methods
    const scrollHandler = () => {
      const parentHeight = blockElement.value.offsetHeight
      const scrollFactor = Math.max(0, Math.min(window.pageYOffset / parentHeight, 1))
      const transformValue = (scrollFactor * parentHeight) / 2
      imageElement.value.style.transform = `translate3d(0, ${transformValue}px ,0)`
    }

    // lifecycle hooks
    onBeforeMount(() => {
      window.addEventListener('scroll', scrollHandler, false)
    })

    onMounted(() => {
      scrollHandler()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', scrollHandler, false)
    })

    return {
      // refs
      blockElement,
      imageElement
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
