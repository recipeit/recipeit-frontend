<template>
  <div style="z-index: 1000">
    <div class="sheet-modal-container">
      <div
        ref="testt"
        class="testt"
        @click="maybeClose"
        @mousemove="onPointerMove"
        @mousedown="onPointerDown"
        @mouseup="onPointerUp"
        @touchmove="onPointerMove"
        @touchstart="onPointerDown"
        @touchend="onPointerUp"
      >
        <transition name="slide" @after-leave="afterModalTransitionLeave">
          <div ref="modal" class="sheet-modal" :style="modalStyle" v-if="opened && !modalClosed">
            <slot />
          </div>
        </transition>
      </div>
    </div>

    <transition name="fade">
      <div v-if="opened && !modalClosed" class="sheet-modal-backdrop"></div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalClosed: false,
      isDown: false,
      offset: null,
      transformTop: null
    }
  },
  methods: {
    maybeClose(e) {
      if (!this.$refs.modal.contains(e.target) && document.hasFocus()) {
        this.$emit('close')
      }
    },
    afterModalTransitionLeave() {
      this.$emit('closed')
    },
    onPointerDown(e) {
      this.isDown = true
      if (e.changedTouches) {
        this.offset = [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      } else {
        this.offset = [e.clientX, e.clientY]
      }
    },
    onPointerUp() {
      if (this.transformTop > 128 && this.$refs.testt.scrollTop === 0) {
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
      if (this.isDown && this.offset) {
        let mousePosition = event.changedTouches
          ? {
              x: event.changedTouches[0].clientX,
              y: event.changedTouches[0].clientY
            }
          : {
              x: event.clientX,
              y: event.clientY
            }
        this.transformTop = mousePosition.y - this.offset[1]
        if (this.$refs.testt.scrollTop === 0 && this.transformTop >= 0) {
          event.preventDefault()
        }
      }
    }
  },
  computed: {
    modalStyle() {
      if (this.isDown && this.transformTop && this.transformTop >= 0 && this.$refs.testt.scrollTop === 0) {
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
.sheet-modal-container {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  overflow: hidden;
}

.testt {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  margin-top: auto;
  overflow: auto;
  z-index: 11111;
  padding-top: 32px;
}

.sheet-modal {
  display: block;
  transform: translate3d(0, 0, 0);
  width: 100%;
  max-width: 512px;
  box-sizing: border-box;
  transition-property: transform;
  z-index: 12500;
  will-change: transform, opacity;
  transition: transform 0.2s ease;
  margin-top: auto;
}

.sheet-modal-backdrop {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.slide-enter-from,
.slide-leave-to {
  transform: translate3d(0, 100%, 0);
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
