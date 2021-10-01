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
      <slot name="toggle" :focused="toggleFocused" />
    </div>
    <transition name="slide-in">
      <div v-show="opened" ref="dropdownContainer" class="menu__dropdown-container">
        <slot name="dropdown" />
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
      window.addEventListener('click', this.onClick)
      this.opened = true
    },
    hide() {
      if (!this.opened) return
      window.removeEventListener('click', this.onClick)
      this.opened = false
    },
    onClick(event) {
      let tempEl = event?.target
      while (tempEl !== this.$refs.dropdownContainer && tempEl.parentElement) {
        tempEl = tempEl.parentElement
      }

      const clickInside = tempEl === this.$refs.dropdownContainer

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

  // &__toggle-container {
  //   outline: none;
  // }

  &__dropdown-container {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    background-color: var(--color-background-flyout);
    // padding: 12px 16px;
    box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    border-top-right-radius: 8px;

    z-index: 1000;
    overflow: hidden;
  }
}
</style>
