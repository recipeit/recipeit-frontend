<template>
  <div class="sheet-modal-container">
    <transition name="slide">
      <div
        class="sheet-modal"
        v-if="!modalClosed"
        :style="modalStyle"
        @mousemove="onPointerMove"
        @mousedown="onPointerDown"
        @mouseup="onPointerUp"
        @touchmove="onPointerMove"
        @touchstart="onPointerDown"
        @touchend="onPointerUp"
      >
        <div class="sheet-modal__inner">
          <div class="sheet-modal__inner__content">
            Hejka
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet</p>
            <button @click="modalClosed = !modalClosed">ccc</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <transition name="fade">
    <div v-if="!modalClosed" class="sheet-modal-backdrop"></div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      modalClosed: false,
      isDown: false,
      offset: null,
      transformTop: null,
      show: true
    }
  },
  mounted() {
    window.addEventListener('keydown', () => {
      this.modalClosed = false
    })
  },
  methods: {
    onPointerDown(e) {
      this.isDown = true
      this.offset = [e.clientX, e.clientY]
    },
    onPointerUp() {
      this.isDown = false
      this.offset = null
      this.transformTop = null
      this.$nextTick(() => {
        this.modalClosed = true
      })
    },
    onPointerMove(event) {
      event.preventDefault()
      if (this.isDown && this.offset) {
        let mousePosition = {
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
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sheet-modal {
  height: auto;
  // --f7-sheet-bg-color: #fff;
  display: block;
  transform: translate3d(0, 0, 0);
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  // height: var(--f7-sheet-height);
  // display: none;
  box-sizing: border-box;
  transition-property: transform;
  // transform: translate3d(0, 100%, 0);
  background: #fff;
  border-radius: 32px 32px 0 0;
  z-index: 12500;
  will-change: transform, opacity;
  transition: transform 0.2s ease;

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
