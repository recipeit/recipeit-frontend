<template>
  <div class="sheet-modal-instance">
    <div class="sheet-modal-container">
      <transition
        name="slide"
        @before-enter="beforeModalEnter"
        @after-enter="afterModalEnter"
        @before-leave="beforeModalLeave"
        @after-leave="afterModalLeave"
      >
        <div
          v-if="opened && !modalClosed"
          ref="scroller"
          class="sheet-modal-container__scroller"
          :style="scrollerStyle"
          @click="maybeClose"
          @touchmove="onPointerMove"
          @touchstart="onPointerDown"
          @touchend="onPointerUp"
        >
          <div ref="modal" class="sheet-modal">
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

<script>
export default {
  emits: ['close', 'closed'],
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
  data: () => ({
    modalClosing: false,
    modalOpening: false,
    modalClosed: false,
    isDown: false,
    offset: null,
    transformTop: null
  }),
  methods: {
    maybeClose(e) {
      if (!this.blockCloseOnBackdrop && this.$refs.modal && !this.$refs.modal.contains(e.target)) {
        this.$emit('close')
      }
    },
    beforeModalEnter() {
      this.modalOpening = true
    },
    afterModalEnter() {
      this.modalOpening = false
    },
    beforeModalLeave() {
      this.modalClosing = true
    },
    afterModalLeave() {
      this.modalClosing = false
      this.$emit('closed')
    },
    onPointerDown(e) {
      this.isDown = true

      if (this.$refs.scroller.scrollTop !== 0) return

      let tempElement = e.target
      let preventScroll = false
      while (tempElement !== this.$refs.scroller && tempElement.parentElement && this.$refs.scroller) {
        if (tempElement.scrollHeight > tempElement.clientHeight && tempElement.scrollTop > 0) {
          preventScroll = true
          break
        }
        tempElement = tempElement.parentElement
      }

      if (!preventScroll) {
        const { clientX: x, clientY: y } = e.changedTouches[0]
        this.offset = { x, y, initial: true }
      }
    },
    onPointerUp() {
      if (this.transformTop > 128 && this.$refs.scroller.scrollTop === 0) {
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.$emit('close')
          })
        })
      }
      this.isDown = false
      this.offset = null
      this.transformTop = null
    },
    onPointerMove(event) {
      if (this.$refs.scroller.scrollTop !== 0) {
        this.offset = null
      }

      if (this.isDown && this.offset) {
        const { clientX, clientY } = event.changedTouches[0]

        const newOffsetX = clientX - this.offset.x
        const newOffsetY = clientY - this.offset.y

        if (this.offset.initial && Math.abs(newOffsetX) > Math.abs(newOffsetY)) {
          this.offset = null
          return false
        }

        if (this.offset.initial && Math.abs(newOffsetX) < Math.abs(newOffsetY)) {
          this.offset.initial = false
        }

        if (!this.offset.initial) {
          this.transformTop = newOffsetY

          if (this.$refs.scroller.scrollTop === 0 && this.transformTop >= 0) {
            event.preventDefault()
          }
        }
      }
      return false
    }
  },
  computed: {
    scrollerStyle() {
      if (this.isDown && this.transformTop && this.transformTop >= 0 && this.$refs.scroller.scrollTop === 0) {
        return {
          transform: `translate3d(0, ${this.transformTop}px, 0)`,
          'transition-duration': '0ms'
        }
      }
      return null
    }
  }
}
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
</style>
