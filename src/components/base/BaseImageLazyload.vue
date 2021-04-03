<template>
  <div :class="classList">
    <img :src="renderSrc" @load="onLoadHandler($event)" @error="onErrorHandler($event)" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    errorPlaceholder: String,
    intersectionOptions: {
      type: Object,
      default: () => ({
        rootMargin: `0px 0px 100px 0px`
      })
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
        'base-image-lazyload--error': this.error
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
.base-image-lazyload {
  img {
    opacity: 0;
    @include transition(opacity);
  }

  &--loaded,
  &--error {
    & img {
      opacity: 1;
    }
  }
}
</style>
