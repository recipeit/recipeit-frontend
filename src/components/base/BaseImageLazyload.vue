<template>
  <div :class="classList">
    <img :src="renderSrc" class="image" @load="onLoadHandler($event)" @error="onErrorHandler($event)" />
    <img v-if="blurredBackground" class="blurred-background" :src="renderSrc" />
  </div>
</template>

<script>
export default {
  emits: ['load', 'error'],
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
        rootMargin: `0px 0px 100px 0px`
      })
    },
    blurredBackground: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    observer: null,
    loaded: false,
    error: false,
    renderSrc: null
  }),
  methods: {
    load() {
      this.renderSrc = this.src
    },
    onLoadHandler(event) {
      this.loaded = true
      this.$emit('load', event)
    },
    onErrorHandler(event) {
      this.error = true
      this.renderSrc = this.src
      this.$emit('error', event)
    }
  },
  computed: {
    classList() {
      return {
        'base-image-lazyload': true,
        'base-image-lazyload--loaded': this.loaded,
        'base-image-lazyload--error': this.error,
        'base-image-lazyload--with-blurred-background': this.blurredBackground
      }
    }
  },
  mounted() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        const image = entries[0]

        if (image.isIntersecting) {
          this.load()
          this.observer.disconnect()
        }
      }, this.intersectionOptions)

      this.observer.observe(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
$blurred-background-distance: -16px;

.base-image-lazyload {
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
