<template>
  <div ref="block" :class="globalClasses" :style="globalStyles">
    <div class="recipe-parallax-gallery__controls">
      <button
        class="recipe-parallax-gallery__controls__left"
        @click.prevent="changeCurrentToPrevious()"
        :disabled="isCurrentImageFirst ? true : null"
      >
        <BaseIcon icon="angle-left" />
      </button>
      <button
        class="recipe-parallax-gallery__controls__right"
        @click.prevent="changeCurrentToNext()"
        :disabled="isCurrentImageLast ? true : null"
      >
        <BaseIcon icon="angle-right" />
      </button>
    </div>
    <div class="recipe-parallax-gallery__indicators">
      <span
        :class="['recipe-parallax-gallery__indicator', { 'recipe-parallax-gallery__indicator--current': currentImageIndex === index }]"
        v-for="(_, index) in imageObjects"
        :key="index"
      ></span>
    </div>
    <div
      ref="images"
      class="recipe-parallax-gallery__images"
      @mousedown="mouseDownHandler($event)"
      @mousemove="mouseMoveHandler($event)"
      @mouseup="mouseUpHandler()"
      @touchstart="touchStartHanlder($event)"
      @touchmove="touchMoveHandler($event)"
      @touchend="touchEndHandler()"
    >
      <BaseImageLazyload
        :id="image.id"
        :class="imageClasses(index)"
        v-for="(image, index) in imageObjects"
        :src="image.src"
        :key="index"
        @click="move(index)"
      />
    </div>
  </div>
</template>

<script>
import uniqueID from '@/functions/uniqueID'

export default {
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      changingCurrentIndex: false,
      preparingChangingCurrentIndex: false,
      isPointerDown: false,
      offset: null,
      movement: 0,
      currentImageIndex: 0
    }
  },
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
      this.$refs.images.style.transform = `translate3d(0, ${transformValue}px ,0)`
    },
    imageClasses(index) {
      return [
        'recipe-parallax-gallery__image',
        {
          'recipe-parallax-gallery__image--current': this.currentImageIndex === index,
          'recipe-parallax-gallery__image--previous': this.currentImageIndex - 1 === index,
          'recipe-parallax-gallery__image--next': this.currentImageIndex + 1 === index
        }
      ]
    },
    mouseDownHandler(event) {
      if (this.preparingChangingCurrentIndex) return
      this.isPointerDown = true
      this.offset = [event.clientX, event.clientY]
    },
    mouseMoveHandler(event) {
      if (this.isPointerDown && this.offset) {
        event.preventDefault()
        this.onPointerMove({
          x: event.clientX,
          y: event.clientY
        })
      }
    },
    mouseUpHandler() {
      this.onPointerUp()
    },
    touchStartHanlder(event) {
      if (this.preparingChangingCurrentIndex) return
      this.isPointerDown = true
      this.offset = [event.changedTouches[0].clientX, event.changedTouches[0].clientY]
    },
    touchMoveHandler(event) {
      if (this.isPointerDown && this.offset) {
        event.preventDefault()
        this.onPointerMove({
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY
        })
      }
    },
    touchEndHandler() {
      this.onPointerUp()
    },
    onPointerMove(mousePosition) {
      this.movement = {
        value: mousePosition.x - this.offset[0],
        unit: 'px'
      }
      if (this.isCurrentImageFirst && this.movement.value > 0) {
        this.movement.value = 0
      } else if (this.isCurrentImageLast && this.movement.value < 0) {
        this.movement.value = 0
      }
    },
    onPointerUp() {
      if (this.movement.value > 128) {
        this.changeCurrentToPrevious()
      } else if (this.movement.value < -128) {
        this.changeCurrentToNext()
      } else {
        this.movement = null
      }
      this.isPointerDown = false
      this.offset = null
    },
    transitionEndPrevHandler(e) {
      if (e.target.id === this.imageObjects[this.currentImageIndex - 1]?.id) {
        this.changingCurrentIndex = true
        this.$refs.images.removeEventListener('transitionend', this.transitionEndPrevHandler, false)
        this.currentImageIndex--
        this.movement = null
        setTimeout(() => {
          this.changingCurrentIndex = false
          this.preparingChangingCurrentIndex = false
        }, 0)
      }
    },
    transitionEndNextHandler(e) {
      if (e.target.id === this.imageObjects[this.currentImageIndex + 1]?.id) {
        this.changingCurrentIndex = true
        this.$refs.images.removeEventListener('transitionend', this.transitionEndNextHandler, false)
        this.currentImageIndex++
        this.movement = null
        setTimeout(() => {
          this.changingCurrentIndex = false
          this.preparingChangingCurrentIndex = false
        }, 0)
      }
    },
    changeCurrentToPrevious() {
      if (this.isCurrentImageFirst) return
      this.$refs.images.addEventListener('transitionend', this.transitionEndPrevHandler, false)
      this.preparingChangingCurrentIndex = true
      this.movement = {
        value: 100,
        unit: '%'
      }
    },
    changeCurrentToNext() {
      if (this.isCurrentImageLast) return
      this.$refs.images.addEventListener('transitionend', this.transitionEndNextHandler, false)
      this.preparingChangingCurrentIndex = true
      this.movement = {
        value: -100,
        unit: '%'
      }
    }
  },
  computed: {
    globalClasses() {
      return [
        'recipe-parallax-gallery',
        { 'recipe-parallax-gallery--pointer-down': this.isPointerDown },
        { 'recipe-parallax-gallery--changing-current-index': this.changingCurrentIndex }
      ]
    },
    globalStyles() {
      if (this.movement) {
        return {
          '--recipe-parallax-gallery-movement': `${this.movement.value}${this.movement.unit}`
        }
      }
      return {
        '--recipe-parallax-gallery-movement': '0px'
      }
    },
    imageObjects() {
      return this.images.map(i => {
        return {
          id: `parallax-image-${uniqueID().getID()}`,
          ...i
        }
      })
    },
    isCurrentImageLast() {
      return this.currentImageIndex + 1 === this.imageObjects.length
    },
    isCurrentImageFirst() {
      return this.currentImageIndex === 0
    }
  }
}
</script>

<style lang="scss">
.recipe-parallax-gallery {
  $root: &;

  height: 320px;
  position: relative;
  overflow: hidden;

  &__controls {
    display: none;

    @media (hover: hover) and (pointer: fine) {
      display: initial;
    }

    &__left,
    &__right {
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

    &__left {
      left: 32px;
    }

    &__right {
      right: 32px;
    }
  }

  &__indicators {
    position: absolute;
    bottom: 3rem;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
  }

  &__indicator {
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    margin: 0.25rem;
    background-color: rgba(var(--color-background-rgb), 0.5);
    border-radius: 50px;
    @include transition(background-color);

    &--current {
      background-color: rgba(var(--color-background-rgb), 0.95);
    }
  }

  &__images {
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;
    background-color: var(--color-image-background);
  }

  &__image {
    width: 100%;
    height: 100%;
    display: none;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    &--previous,
    &--current,
    &--next {
      display: block;
      transform: translate3d(var(--recipe-parallax-gallery-movement), 0, 0);
      @include transition(transform, 0.15s, ease);

      #{ $root }--pointer-down &,
      #{ $root }--changing-current-index & {
        transition-duration: 0s;
      }
    }

    &--previous,
    &--next {
      position: absolute;
    }

    &--previous {
      top: 0;
      right: 100%;
    }

    &--next {
      top: 0;
      left: 100%;
    }
  }
}
</style>
