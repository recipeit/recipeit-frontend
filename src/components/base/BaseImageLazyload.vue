<template>
  <div ref="mainElement" :class="classList">
    <img v-if="visible" :src="renderSrc" class="image" @load.passive="onLoadHandler($event)" @error.passive="onErrorHandler($event)" />
    <img v-if="blurredBackground" class="blurred-background" :src="renderSrc" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue'

export default defineComponent({
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

  setup(props, { emit }) {
    // template refs
    const mainElement = ref(null)

    // internal data
    let observer: IntersectionObserver = null

    // data
    const data = reactive({
      loaded: false,
      error: false,
      visible: false
    })

    // computed
    const renderSrc = computed(() => {
      return data.visible ? (data.error ? props.errorPlaceholder : props.src) : null
    })

    const classList = computed(() => {
      return {
        'base-image-lazyload': true,
        'base-image-lazyload--loaded': data.loaded,
        'base-image-lazyload--error': data.error,
        'base-image-lazyload--with-blurred-background': props.blurredBackground
      }
    })

    // internal methods
    const reset = () => {
      observer?.disconnect()
      observer = null
      data.visible = false
      data.loaded = false
      data.error = false
    }

    const init = () => {
      if ('IntersectionObserver' in window) {
        const isInViewport = (element: HTMLElement) => {
          const rect = element.getBoundingClientRect()
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          )
        }

        const isIntersectingHandler = () => {
          data.visible = true
          observer.disconnect()
        }

        observer = new IntersectionObserver(([image]) => {
          if (image.isIntersecting) {
            isIntersectingHandler()
          }
        }, props.intersectionOptions)

        if (isInViewport(mainElement.value)) {
          isIntersectingHandler()
        } else {
          observer.observe(mainElement.value)
        }
      }
    }

    // methods
    const onLoadHandler = (event: Event) => {
      data.loaded = true
      emit('load', event)
    }

    const onErrorHandler = event => {
      data.error = true
      emit('error', event)
    }

    // watchers
    watch(
      () => props.src,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          reset()
          init()
        }
      }
    )

    // lifecycle hooks
    onMounted(() => {
      if (props.src) {
        init()
      }
    })

    onBeforeUnmount(() => {
      reset()
    })

    return {
      // template refs
      mainElement,
      // data
      ...toRefs(data),
      // computed
      renderSrc,
      classList,
      // methods
      onLoadHandler,
      onErrorHandler
    }
  }
})
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
