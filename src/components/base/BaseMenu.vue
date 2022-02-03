<template>
  <div class="menu" @keyup.esc.stop="hide()">
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
      <div v-show="opened" ref="dropdownContainerElement" class="menu__dropdown-container">
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'

export default defineComponent({
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

  setup(props) {
    // refs
    const dropdownContainerElement = ref(null)

    // data
    const data = reactive({
      opened: false,
      toggleFocused: false
    })

    // methods
    const toggle = (event: Event) => {
      if (data.opened) {
        hide()
      } else {
        open(event)
      }
    }

    const open = (event: Event) => {
      if (data.opened) return
      event.stopPropagation()
      window.addEventListener('click', onClick)
      data.opened = true
    }

    const hide = () => {
      if (!data.opened) return
      window.removeEventListener('click', onClick)
      data.opened = false
    }

    const onClick = (event: Event) => {
      let tempEl = event?.target as HTMLElement // TODO znowu nie wiem dlaczego on tego nie wie
      while (tempEl !== dropdownContainerElement.value && tempEl.parentElement) {
        tempEl = tempEl.parentElement
      }

      const clickInside = tempEl === dropdownContainerElement.value

      if (props.hideOnClick || !clickInside) {
        hide()
      }
    }

    return {
      // refs
      dropdownContainerElement,
      // data
      ...toRefs(data),
      // methods
      toggle,
      open,
      hide
    }
  },

  methods: {}
})
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
