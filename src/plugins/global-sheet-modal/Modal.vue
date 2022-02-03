<template>
  <div class="sheet-modal-instance">
    <div class="sheet-modal-container">
      <transition
        name="slide"
        @before-enter="beforeModalEnter()"
        @after-enter="afterModalEnter()"
        @before-leave="beforeModalLeave()"
        @after-leave="afterModalLeave()"
      >
        <div
          v-if="opened && !modalClosed"
          ref="scrollerElement"
          class="sheet-modal-container__scroller"
          :style="scrollerStyle"
          @click="maybeClose($event)"
          @touchmove="onPointerMove($event)"
          @touchstart="onPointerDown($event)"
          @touchend="onPointerUp()"
        >
          <div ref="modalElement" class="sheet-modal">
            <slot />
          </div>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="opened && !modalClosed" class="sheet-modal-backdrop" />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, toRefs } from 'vue'

export default defineComponent({
  props: {
    opened: {
      type: Boolean,
      default: false
    },
    blockCloseOnBackdrop: {
      type: Boolean,
      default: false
    }
  },

  emits: ['close', 'closed'],

  setup(props, { emit }) {
    // refs
    const modalElement = ref<HTMLDivElement>(null)
    const scrollerElement = ref<HTMLDivElement>(null)

    // data
    const data = reactive({
      modalClosing: false,
      modalOpening: false,
      modalClosed: false,
      isDown: false,
      offset: null as { x: number; y: number; initial: boolean },
      transformTop: null as number
    })

    // computed
    const scrollerStyle = computed(() => {
      if (data.isDown && data.transformTop >= 0 && scrollerElement.value.scrollTop === 0) {
        return {
          transform: `translate3d(0, ${data.transformTop}px, 0)`,
          'transition-duration': '0ms'
        }
      }
      return null
    })

    // methods
    const maybeClose = (e: MouseEvent) => {
      // TODO z jakiegoś powodu narzeka
      if (!props.blockCloseOnBackdrop && modalElement.value && !modalElement.value.contains(e.target as HTMLElement)) {
        emit('close')
      }
    }

    const beforeModalEnter = () => {
      data.modalOpening = true
    }

    const afterModalEnter = () => {
      data.modalOpening = false
    }

    const beforeModalLeave = () => {
      data.modalClosing = true
    }

    const afterModalLeave = () => {
      data.modalClosing = false
      emit('closed')
    }

    const onPointerDown = (e: TouchEvent) => {
      data.isDown = true

      if (scrollerElement.value.scrollTop !== 0) return

      let tempElement = e.target as HTMLElement // TODO z jakiegoś powodu narzeka
      let preventScroll = false
      while (tempElement !== scrollerElement.value && tempElement.parentElement && scrollerElement.value) {
        if (tempElement.scrollHeight > tempElement.clientHeight && tempElement.scrollTop > 0) {
          preventScroll = true
          break
        }
        tempElement = tempElement.parentElement
      }

      if (!preventScroll) {
        const { clientX: x, clientY: y } = e.changedTouches[0]
        data.offset = { x, y, initial: true }
      }
    }

    const onPointerMove = (event: TouchEvent) => {
      if (scrollerElement.value.scrollTop !== 0) {
        data.offset = null
      }

      if (data.isDown && data.offset) {
        const { clientX, clientY } = event.changedTouches[0]

        const newOffsetX = clientX - data.offset.x
        const newOffsetY = clientY - data.offset.y

        if (data.offset.initial && Math.abs(newOffsetX) > Math.abs(newOffsetY)) {
          data.offset = null
          return false
        }

        if (data.offset.initial && Math.abs(newOffsetX) < Math.abs(newOffsetY)) {
          data.offset.initial = false
        }

        if (!data.offset.initial) {
          data.transformTop = newOffsetY

          if (scrollerElement.value.scrollTop === 0 && data.transformTop >= 0) {
            event.preventDefault()
          }
        }
      }
      return false
    }

    const onPointerUp = () => {
      if (!props.blockCloseOnBackdrop && data.transformTop > 128 && scrollerElement.value.scrollTop === 0) {
        nextTick(() => {
          nextTick(() => {
            emit('close')
          })
        })
      }
      data.isDown = false
      data.offset = null
      data.transformTop = null
    }

    return {
      // refs
      modalElement,
      scrollerElement,
      // data
      ...toRefs(data),
      // computed
      scrollerStyle,
      // methods
      maybeClose,
      beforeModalEnter,
      afterModalEnter,
      beforeModalLeave,
      afterModalLeave,
      onPointerDown,
      onPointerMove,
      onPointerUp
    }
  }
})
</script>

<style lang="scss" scoped>
.sheet-modal-instance {
  position: fixed;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1000;

  .sheet-modal-container {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    overflow: hidden;

    &__scroller {
      position: absolute;
      left: 0;
      bottom: 0;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      margin-top: auto;
      overflow: auto;
      z-index: 1002;
      padding-top: 32px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
  }

  .sheet-modal-backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-modal-backdrop);
    // backdrop-filter: saturate(180%) blur(4px);
    z-index: 1001;
  }

  .sheet-modal {
    display: block;
    transform: translate3d(0, 0, 0);
    width: 100%;
    max-width: 512px;
    box-sizing: border-box;
    z-index: 12500;
    margin-top: auto;

    @media (min-width: 721px) {
      margin-bottom: auto;
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translate3d(0, 100%, 0);

    @media (min-width: 721px) {
      transform: scale(0.5);
      opacity: 0;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
