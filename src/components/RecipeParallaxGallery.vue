<template>
  <div ref="block" class="recipe-parallax-gallery">
    <div class="gallery-controls">
      <button class="gallery-control-left" @click.prevent="showPrev()" :disabled="isCurrentImageFirst ? true : null">
        <BaseIcon icon="angle-left" />
      </button>
      <button class="gallery-control-right" @click.prevent="showNext()" :disabled="isCurrentImageLast ? true : null">
        <BaseIcon icon="angle-right" />
      </button>
    </div>
    <div v-if="images?.length > 1" class="gallery-indicators">
      <span
        :class="['gallery-indicator', { 'gallery-indicator--current': currentImageIndex === index }]"
        v-for="(_, index) in images"
        :key="index"
        @click="scrollTo(index)"
      />
    </div>
    <div
      ref="images"
      class="gallery-images"
      @touchstart="isTouching = true"
      @touchend="isTouching = false"
      @touchcancel="isTouching = false"
    >
      <BaseImageLazyload class="gallery-image" v-for="(image, index) in images" :key="index" :src="image.src" :ref="setImageRef" />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentImageIndex: 0,
      isTouching: false,
      onScrollTimeout: null,
      imageRefs: []
    }
  },
  beforeUpdate() {
    this.imageRefs = []
  },
  mounted() {
    this.imagesScrollHandler = debounce(this.imagesScrollHandlerDebounced, 200)
    this.checkGalleryStoppedInMiddleHandler = debounce(this.checkGalleryStoppedInMiddle, 500)
    this.windowScrollHandler()

    window.addEventListener('scroll', this.windowScrollHandler, false)
    window.addEventListener('resize', this.checkGalleryStoppedInMiddleHandler, false)
    this.$refs.images.addEventListener('scroll', this.imagesScrollHandler, false)
    this.$refs.images.addEventListener('scroll', this.checkGalleryStoppedInMiddleHandler, false)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.windowScrollHandler, false)
    window.removeEventListener('resize', this.checkGalleryStoppedInMiddleHandler, false)
    this.$refs.images.removeEventListener('scroll', this.imagesScrollHandler, false)
    this.$refs.images.removeEventListener('scroll', this.checkGalleryStoppedInMiddleHandler, false)
  },
  methods: {
    setImageRef(el) {
      const $el = el?.$el
      if ($el) {
        this.imageRefs.push($el)
      }
    },
    showPrev() {
      if (this.currentImageIndex > 0) {
        this.scrollTo(this.currentImageIndex - 1)
      }
    },
    showNext() {
      if (this.currentImageIndex < this.images.length) {
        this.scrollTo(this.currentImageIndex + 1)
      }
    },
    scrollTo(index) {
      if (!this.imageRefs) return
      const imageEl = this.imageRefs[index]
      if (imageEl) {
        if (this.$refs.images && this.$refs.images.scrollLeft !== imageEl.offsetLeft) {
          this.$refs.images?.scrollTo({
            left: imageEl.offsetLeft,
            behavior: 'smooth'
          })
        }
        if (this.currentImageIndex !== index) {
          this.currentImageIndex = index
        }
      }
    },
    windowScrollHandler() {
      const parentHeight = this.$refs.block.offsetHeight
      const scrollFactor = Math.max(0, Math.min(window.pageYOffset / parentHeight, 1))
      const transformValue = (scrollFactor * parentHeight) / 2
      this.$refs.images.style.transform = `translate3d(0, ${transformValue}px ,0)`
    },
    calculateCurrentIndex() {
      const { scrollLeft, scrollWidth } = this.$refs.images
      return Math.round((scrollLeft / scrollWidth) * this.images.length)
    },
    imagesScrollHandlerDebounced() {
      const index = this.calculateCurrentIndex()
      if (this.currentImageIndex !== index) {
        this.currentImageIndex = index
      }
    },
    // resizeHandlerDebounced() {
    //   if (!this.isTouching) {
    //     this.scrollTo(this.calculateCurrentIndex())
    //   }
    // },
    checkGalleryStoppedInMiddle() {
      console.log('CHECK')
      if (!this.isTouching) {
        this.scrollTo(this.calculateCurrentIndex())
      }
    }
  },
  computed: {
    isCurrentImageLast() {
      return this.currentImageIndex + 1 === this.images.length
    },
    isCurrentImageFirst() {
      return this.currentImageIndex === 0
    }
  }
}
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
      height: 3rem;
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      transform: translateY(-25%);
      opacity: 0.5;
      background: transparent;
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

    ::v-deep(img) {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
