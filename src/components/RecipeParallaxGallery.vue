<template>
  <div ref="blockElement" class="recipe-parallax-gallery">
    <div class="gallery-controls">
      <button class="gallery-control-left" :disabled="isCurrentImageFirst ? true : null" @click.prevent="showPrev()">
        <BaseIcon icon="angle-left" />
      </button>
      <button class="gallery-control-right" :disabled="isCurrentImageLast ? true : null" @click.prevent="showNext()">
        <BaseIcon icon="angle-right" />
      </button>
    </div>
    <div v-if="images?.length > 1" class="gallery-indicators">
      <span
        v-for="(_, index) in images"
        :key="index"
        :class="['gallery-indicator', { 'gallery-indicator--current': currentImageIndex === index }]"
        @click="scrollTo(index)"
      />
    </div>
    <div
      ref="imagesElement"
      class="gallery-images"
      @touchstart="isTouching = true"
      @touchend="isTouching = false"
      @touchcancel="isTouching = false"
    >
      <BaseImageLazyload
        v-for="(image, index) in images"
        :key="index"
        :ref="setImageRef"
        class="gallery-image"
        :src="image.src"
        :blurred-background="true"
        :error-placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script lang="ts">
import debounce from 'lodash.debounce'
import { computed, defineComponent, onBeforeUnmount, onBeforeUpdate, onMounted, PropType, reactive, ref, toRefs } from 'vue'

import placeholderDark from '@/assets/img/placeholders/recipe-image-dark.webp'
import placeholderLight from '@/assets/img/placeholders/recipe-image.webp'

import { useUserStore } from '@/stores/user'

export default defineComponent({
  props: {
    images: {
      type: Array as PropType<Array<{ src: string }>>,
      required: true
    },
    firstImagePosition: {
      type: String,
      default: 'center'
    }
  },
  setup(props) {
    // usings
    const userStore = useUserStore()

    // refs
    const blockElement = ref(null)
    const imagesElement = ref(null)

    // data
    const data = reactive({
      currentImageIndex: 0,
      isTouching: false,
      onScrollTimeout: null,
      imageRefs: []
    })

    // computed
    const placeholder = computed(() => (userStore.theme === 'dark' ? placeholderDark : placeholderLight))

    const isCurrentImageLast = computed(() => {
      return data.currentImageIndex + 1 === props.images.length
    })

    const isCurrentImageFirst = computed(() => {
      return data.currentImageIndex === 0
    })

    // methods
    const scrollTo = index => {
      if (!data.imageRefs) return
      const imageEl = data.imageRefs[index]
      if (imageEl) {
        if (imagesElement.value && imagesElement.value.scrollLeft !== imageEl.offsetLeft) {
          imagesElement.value?.scrollTo({
            left: imageEl.offsetLeft,
            behavior: 'smooth'
          })
        }
        if (data.currentImageIndex !== index) {
          data.currentImageIndex = index
        }
      }
    }

    const showNext = () => {
      if (data.currentImageIndex < props.images.length) {
        scrollTo(data.currentImageIndex + 1)
      }
    }

    const setImageRef = el => {
      const $el = el?.$el
      if ($el) {
        data.imageRefs.push($el)
      }
    }

    const showPrev = () => {
      if (data.currentImageIndex > 0) {
        scrollTo(data.currentImageIndex - 1)
      }
    }

    const windowScrollHandler = () => {
      const parentHeight = blockElement.value.offsetHeight
      const scrollFactor = Math.max(0, Math.min(window.pageYOffset / parentHeight, 1))
      const transformValue = (scrollFactor * parentHeight) / 2
      imagesElement.value.style.transform = `translate3d(0, ${transformValue}px ,0)`
    }

    const calculateCurrentIndex = () => {
      if (!imagesElement.value) return 0
      const { scrollLeft, scrollWidth } = imagesElement.value
      return Math.round((scrollLeft / scrollWidth) * props.images.length)
    }

    const imagesScrollHandlerDebounced = () => {
      const index = calculateCurrentIndex()
      if (data.currentImageIndex !== index) {
        data.currentImageIndex = index
      }
    }

    const checkGalleryStoppedInMiddle = () => {
      if (!data.isTouching) {
        scrollTo(calculateCurrentIndex())
      }
    }

    // lifecycle hooks
    let imagesScrollHandler
    let checkGalleryStoppedInMiddleHandler

    onMounted(() => {
      imagesScrollHandler = debounce(imagesScrollHandlerDebounced, 200)
      checkGalleryStoppedInMiddleHandler = debounce(checkGalleryStoppedInMiddle, 500)
      windowScrollHandler()

      window.addEventListener('scroll', windowScrollHandler, false)
      window.addEventListener('resize', checkGalleryStoppedInMiddleHandler, false)
      imagesElement.value.addEventListener('scroll', imagesScrollHandler, false)
      imagesElement.value.addEventListener('scroll', checkGalleryStoppedInMiddleHandler, false)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', windowScrollHandler, false)
      window.removeEventListener('resize', checkGalleryStoppedInMiddleHandler, false)
      imagesElement.value.removeEventListener('scroll', imagesScrollHandler, false)
      imagesElement.value.removeEventListener('scroll', checkGalleryStoppedInMiddleHandler, false)
    })

    onBeforeUpdate(() => {
      data.imageRefs = []
    })

    return {
      // refs
      blockElement,
      imagesElement,
      // data
      ...toRefs(data),
      // computed
      placeholder,
      isCurrentImageLast,
      isCurrentImageFirst,
      // methods
      scrollTo,
      showNext,
      setImageRef,
      showPrev
    }
  }
})
</script>

<style lang="scss" scoped>
.recipe-parallax-gallery {
  $root: &;

  height: 320px;
  position: relative;
  overflow: hidden;
  // transform-style: preserve-3d;

  .gallery-controls {
    display: none;

    @include cursor-only {
      display: initial;
    }

    .gallery-control-left,
    .gallery-control-right {
      position: absolute;
      top: 50%;
      z-index: 10;
      height: 2.5rem;
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transform: translateY(-25%);
      opacity: 0.75;
      background-color: rgba(var(--color-background-rgb), 0.25);
      color: var(--color-text-primary);
      border-radius: 48px;
      border: none;
      @include transition(opacity);

      &:not(:disabled) {
        cursor: pointer;
      }

      &:hover {
        opacity: 1;
      }

      &:disabled {
        opacity: 0;
      }
    }

    .gallery-control-left {
      left: 32px;
    }

    .gallery-control-right {
      right: 32px;
    }
  }

  .gallery-indicators {
    position: absolute;
    bottom: 3rem;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .gallery-indicator {
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    margin: 0.25rem;
    background-color: rgba(var(--color-background-rgb), 0.5);
    border-radius: 50px;
    cursor: pointer;
    @include transition(background-color);

    @include cursor-only {
      &:hover {
        background-color: rgba(var(--color-background-rgb), 0.95);
      }
    }

    &--current {
      background-color: rgba(var(--color-background-rgb), 0.95);
      cursor: initial;
    }
  }

  .gallery-images {
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;

    // transform-origin: 0 0;
    // transform: translateZ(-1px) scale(2);
    background-color: var(--color-image-background);

    scroll-snap-type: x mandatory;
    display: flex;
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: 721px) {
      transform: none !important;
    }
  }

  .gallery-image {
    flex-shrink: 0;
    scroll-snap-align: start;
    width: 100%;
    height: 100%;
    scroll-snap-stop: always;

    :deep(.image) {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    // @media (min-width: 721px) {
    :deep(.image) {
      object-fit: contain;
    }

    :deep(.blurred-background) {
      display: block;
      object-fit: cover;
      // width: 100%;
      // height: 100%;
    }
    // }
  }
}
</style>
