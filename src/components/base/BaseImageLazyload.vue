<template>
  <div :class="classList">
    <img v-if="visible" :src="renderSrc" class="image" @load.passive="onLoadHandler($event)" @error.passive="onErrorHandler($event)" />
    <img v-if="blurredBackground" class="blurred-background" :src="renderSrc" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    errorPlaceholder: {
      type: String
    },
    intersectionOptions: {
      type: Object,
      default: () => ({
        rootMargin: `100px`
      })
    },
    blurredBackground: {
      type: Boolean,
      default: false
    }
  },
  emits: ['load', 'error'],
  data: () => ({
    observer: null,
    loaded: false,
    error: false,
    visible: false
  }),
  computed: {
    renderSrc() {
      return this.visible ? (this.error ? this.errorPlaceholder : this.src) : null
    },
    classList() {
      return {
        'base-image-lazyload': true,
        'base-image-lazyload--loaded': this.loaded,
        'base-image-lazyload--error': this.error,
        'base-image-lazyload--with-blurred-background': this.blurredBackground
      }
    }
  },
  watch: {
    src(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reset()
        this.init()
      }
    }
  },
  mounted() {
    if (this.src) {
      this.init()
    }
  },
  beforeUnmount() {
    this.reset()
  },
  methods: {
    onLoadHandler(event) {
      this.loaded = true
      this.$emit('load', event)
    },
    onErrorHandler(event) {
      this.error = true
      this.$emit('error', event)
    },
    reset() {
      this.observer?.disconnect()
      this.observer = null
      this.visible = false
      this.loaded = false
      this.error = false
    },
    init() {
      if ('IntersectionObserver' in window) {
        const isInViewport = element => {
          const rect = element.getBoundingClientRect()
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          )
        }

        const isIntersectingHandler = () => {
          this.visible = true
          this.observer.disconnect()
        }

        this.observer = new IntersectionObserver(([image]) => {
          if (image.isIntersecting) {
            isIntersectingHandler()
          }
        }, this.intersectionOptions)

        if (isInViewport(this.$el)) {
          isIntersectingHandler()
        } else {
          this.observer.observe(this.$el)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$blurred-background-distance: -16px;

.base-image-lazyload {
  font-size: 0;

  &.base-image-lazyload--with-blurred-background {
    position: relative;
    overflow: hidden;
  }

  .image {
    opacity: 0;
    @include transition(opacity);
  }

  .blurred-background {
    display: none;
    filter: blur(8px);
    position: absolute;
    top: $blurred-background-distance;
    left: $blurred-background-distance;
    right: $blurred-background-distance;
    bottom: $blurred-background-distance;
    width: calc(100% - #{2 * $blurred-background-distance});
    height: calc(100% - #{2 * $blurred-background-distance});
    z-index: -1;
    opacity: 0;
    @include transition(opacity);
  }

  &--loaded,
  &--error {
    .image,
    .blurred-background {
      opacity: 1;
    }
  }
}
</style>
