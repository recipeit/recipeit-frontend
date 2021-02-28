<template>
  <!-- @focus="open()" -->
  <!-- @blur="searchable ? false : hide()" -->
  <div
    class="menu"
    @keyup.esc.stop="hide()"
    @keydown.self.down.prevent="pointerForward()"
    @keydown.self.up.prevent="pointerBackward()"
    @keypress.enter.tab.stop.self="addPointerElement()"
  >
    <div
      class="menu__toggle-container"
      :tabindex="toggleTabindex"
      @focus="toggleFocused = true"
      @blur="toggleFocused = false"
      @click="open($event)"
      @keypress.enter.stop.self="toggle($event)"
    >
      <slot name="toggle" :focused="toggleFocused"></slot>
    </div>
    <transition name="slide-in">
      <div ref="dropdownContainer" v-show="opened" class="menu__dropdown-container">
        <slot name="dropdown"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    toggleTabindex: {
      type: Number,
      default: 0
    },
    hideOnClick: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    opened: false,
    toggleFocused: false
  }),
  methods: {
    toggle(event) {
      if (this.opened) {
        this.hide()
      } else {
        this.open(event)
      }
    },
    open(event) {
      if (this.opened) return
      event.stopPropagation()
      console.log('open this', this)
      window.addEventListener('click', this.onClick)
      this.opened = true
    },
    hide() {
      // console.log('hide')
      if (!this.opened) return
      window.removeEventListener('click', this.onClick)
      this.opened = false
    },
    onClick(event) {
      // console.log('onClick')

      let tempEl = event?.target
      // console.log(tempEl)
      while (tempEl !== this.$refs.dropdownContainer && tempEl.parentElement) {
        tempEl = tempEl.parentElement
      }
      // console.log(tempEl)

      const clickInside = tempEl === this.$refs.dropdownContainer
      // console.log('clickInside', clickInside)
      // console.log('onClick this', this)

      if (this.hideOnClick || !clickInside) {
        this.hide()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  position: relative;
  outline: none;

  &__toggle-container {
    outline: none;
  }

  &__dropdown-container {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    background-color: white;
    // padding: 12px 16px;
    box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    border-top-right-radius: 8px;
    z-index: 1000;
    overflow: hidden;
  }
}
</style>
