<template>
  <div style="z-index: 1000">
    <div class="sheet-modal-container">
      <transition name="slide" @after-leave="afterModalTransitionLeave">
        <div
          class="sheet-modal"
          v-if="opened && !modalClosed"
          :style="modalStyle"
          @mousemove="onPointerMove"
          @mousedown="onPointerDown"
          @mouseup="onPointerUp"
          @touchmove="onPointerMove"
          @touchstart="onPointerDown"
          @touchend="onPointerUp"
        >
          <slot @close="heyy" />
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div v-if="opened && !modalClosed" class="sheet-modal-backdrop" @click="this.modalClosed = true"></div>
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
    heyy() {
      alert('fhuihfiru')
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
      this.isDown = false
      this.offset = null
      this.transformTop = null
      // this.$nextTick(() => {
      //   this.modalClosed = true
      // })
    },
    onPointerMove(event) {
      event.preventDefault()
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
      }
    }
  },
  computed: {
    modalStyle() {
      if (this.isDown && this.transformTop && this.transformTop >= 0) {
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

.sheet-modal {
  height: auto;
  display: block;
  transform: translate3d(0, 0, 0);
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  transition-property: transform;
  background: #fff;
  border-radius: 32px 32px 0 0;
  z-index: 12500;
  will-change: transform, opacity;
  transition: transform 0.2s ease;
  max-height: calc(100% - 32px);
  overflow: auto;

  &__inner {
    height: 100%;
    position: relative;
    overflow: hidden;

    &__content {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      height: 100%;
      position: relative;
      z-index: 1;
      padding: 32px;
    }
  }
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
