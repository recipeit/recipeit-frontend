<template>
  <div
    class="select"
    :tabindex="searchable ? -1 : 1"
    @focus="open()"
    @blur="searchable ? false : hide()"
    @keyup.esc.stop="hide()"
    @keydown.self.down.prevent="pointerForward()"
    @keydown.self.up.prevent="pointerBackward()"
    @keypress.enter.tab.stop.self="addPointerElement()"
  >
    <div :class="['select__field', { 'select__field--selected': modelValue !== null }]">
      <span :class="['select__field__placeholder', { 'select__field__placeholder--small': placeholderAsLabel }]">
        {{ placeholder }}
      </span>
      <template v-if="searchable">
        <input
          v-show="opened"
          :value="search"
          class="select__field__input"
          ref="search"
          tabindex="1"
          @input="updateSearch($event.target.value)"
          @focus.prevent="open()"
          @blur.prevent="hide()"
          @keyup.esc.stop="hide()"
          @keydown.down.prevent="pointerForward()"
          @keydown.up.prevent="pointerBackward()"
          @keypress.enter.prevent.stop.self="addPointerElement()"
        />
      </template>
      <span v-if="showSelectedValue" class="select__field__value">
        <slot name="label" :option="modelValue">
          {{ label ? modelValue[label] : modelValue }}
        </slot>
      </span>
    </div>
    <transition name="fade">
      <div
        v-show="opened"
        @mousedown.prevent
        :class="['select__options', { 'select__options--above': isAbove }]"
        :style="{ maxHeight: optimizedHeight + 'px' }"
      >
        <ul class="select__options__list" v-if="visibleOptions && visibleOptions.length > 0">
          <li
            v-for="(option, index) in visibleOptions"
            :key="option"
            :class="[
              'select__options__list__item',
              { 'select__options__list__item--selected': option === modelValue },
              { 'select__options__list__item--highlight': index === pointer }
            ]"
            @mouseenter.self="pointerSet(index)"
            @click="selectOption(option)"
          >
            <slot name="option" :option="option" :search="search" :index="index">
              {{ label ? option[label] : option }}
            </slot>
          </li>
        </ul>
        <div v-else class="select__options__empty">
          Brak pasujących elementów
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    searchable: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number
    },
    modelValue: { default: null },
    options: {
      type: Array,
      required: true
    },
    trackBy: {
      type: String
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    maxHeight: {
      type: Number,
      default: 210
    }
  },
  data() {
    return {
      search: '',
      opened: false,
      preferredOpenDirection: 'below',
      optimizedHeight: this.maxHeight,
      pointer: null
    }
  },
  methods: {
    addPointerElement() {
      if (this.visibleOptions.length > 0) {
        this.selectOption(this.visibleOptions[this.pointer])
      }
      this.hide()
    },
    pointerForward() {
      if (this.pointer !== null && this.pointer < this.visibleOptions.length - 1) {
        this.pointer++
      } else {
        this.pointer = 0
      }
      // /* istanbul ignore else */
      // if (this.pointer < this.filteredOptions.length - 1) {
      //   this.pointer++
      //   /* istanbul ignore next */
      //   if (this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight) {
      //     this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight
      //   }
      //   /* istanbul ignore else */
      //   if (this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect)
      //     this.pointerForward()
      // }
      // this.pointerDirty = true
    },
    pointerBackward() {
      if (this.pointer !== null && this.pointer > 0) {
        this.pointer--
      } else {
        this.pointer = this.visibleOptions.length - 1
      }
      // if (this.pointer > 0) {
      //   this.pointer--
      //   /* istanbul ignore else */
      //   if (this.$refs.list.scrollTop >= this.pointerPosition) {
      //     this.$refs.list.scrollTop = this.pointerPosition
      //   }
      //   /* istanbul ignore else */
      //   if (this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect)
      //     this.pointerBackward()
      // } else {
      //   /* istanbul ignore else */
      //   if (this.filteredOptions[this.pointer] && this.filteredOptions[0].$isLabel && !this.groupSelect) this.pointerForward()
      // }
      // this.pointerDirty = true
    },
    pointerReset() {
      this.pointer = null
      // /* istanbul ignore else */
      // if (!this.closeOnSelect) return
      // this.pointer = 0
      // /* istanbul ignore else */
      // if (this.$refs.list) {
      //   this.$refs.list.scrollTop = 0
      // }
    },
    pointerSet(index) {
      this.pointer = index
    },
    pointerAdjust() {
      if (this.pointer >= this.visibleOptions.length - 1) {
        this.pointer = this.visibleOptions.length ? this.visibleOptions.length - 1 : 0
      }
    },

    updateSearch(query) {
      this.search = query
    },
    open() {
      console.log('open requested')
      if (this.opened) return

      this.opened = true
      this.adjustPosition()

      if (this.searchable) {
        this.$nextTick(() => this.$refs.search && this.$refs.search.focus())
      } else {
        this.$el.focus()
      }
    },
    hide() {
      console.log(document.activeElement)
      if (!this.opened) return

      this.opened = false
      this.pointerReset()

      if (this.searchable) {
        this.$refs.search && this.$refs.search.blur()
      } else {
        this.$el.blur()
      }
      console.log(document.activeElement)
    },
    selectOption(newValue) {
      this.$emit('update:modelValue', newValue === this.modelValue ? null : newValue)
      if (this.searchable) {
        this.search = ''
      }
      this.hide()
    },
    adjustPosition() {
      if (typeof window === 'undefined') return

      const spaceAbove = this.$el.getBoundingClientRect().top
      const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom
      const hasEnoughSpaceBelow = spaceBelow > this.maxHeight

      if (hasEnoughSpaceBelow || spaceBelow > spaceAbove || this.openDirection === 'below' || this.openDirection === 'bottom') {
        this.preferredOpenDirection = 'below'
        this.optimizedHeight = Math.min(spaceBelow - 40, this.maxHeight)
      } else {
        this.preferredOpenDirection = 'above'
        this.optimizedHeight = Math.min(spaceAbove - 40, this.maxHeight)
      }
    }
  },
  computed: {
    placeholderAsLabel() {
      return this.searchable ? this.opened || this.modelValue !== null : this.modelValue !== null
    },
    showSelectedValue() {
      return this.searchable ? !this.opened && this.modelValue !== null : this.modelValue !== null
    },
    visibleOptions() {
      if (!this.searchable || !this.search) return this.options
      else {
        return this.options.filter(oee => {
          if (typeof oee == 'string' || oee instanceof String) {
            return oee.toLowerCase().includes(this.search.toLowerCase())
          } else if (this.trackBy) {
            return oee[this.trackBy] && oee[this.trackBy].toLowerCase().includes(this.search.toLowerCase())
          }
          return true
        })
      }
    },
    isAbove() {
      // if (this.openDirection === 'above' || this.openDirection === 'top') {
      //   return true
      // } else if (
      //   this.openDirection === 'below' ||
      //   this.openDirection === 'bottom'
      // ) {
      //   return false
      // } else {
      return this.preferredOpenDirection === 'above'
      // }
    }
  },
  watch: {
    visibleOptions() {
      this.pointerAdjust()
    }
  }
}
</script>

<style lang="scss" scoped>
.select {
  position: relative;

  &__field {
    position: relative;
    height: 48px;
    border-bottom: 2px solid $border;
    overflow: hidden;
    cursor: pointer;

    &__placeholder {
      position: absolute;
      height: 48px;
      display: flex;
      align-items: center;
      color: $text-secondary;
      // transform-origin: top left;
      @include transition((height, font-size, color));

      &--small {
        height: 12px;
        font-size: 12px;
        color: $text-primary;
        font-weight: bold;
        // transform: scale(0.75);
      }
    }

    &__input {
      display: block;
      height: 48px;
      display: flex;
      align-items: center;
      // margin-top: 6px;
      border: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      padding: 0;
      padding-top: 6px;
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }

    &__value {
      box-sizing: border-box;
      width: 100%;
      display: block;
      height: 48px;
      display: flex;
      align-items: center;
      padding-top: 6px;
      // margin-top: 6px;
    }

    // &--selected &__placeholder {
    //   height: 12px;
    //   font-size: 12px;
    //   color: $text-primary;
    //   font-weight: bold;
    //   // transform: scale(0.75);
    // }
  }

  &__options {
    position: absolute;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    overflow: hidden;
    overflow: auto;
    font-size: 14px;
    line-height: 20px;

    &__list {
      margin: 8px 0;
      &__item {
        padding: 8px 16px;
        cursor: pointer;
        @include transition((background-color));

        &--highlight {
          // color: $primary;
          background-color: rgba($black, 0.05);
        }

        &--selected {
          font-weight: bold;
          color: $primary;

          &:hover {
            // color: $primary;
            background-color: rgba($primary, 0.1);
          }
        }
      }
    }

    &:not(&--above) {
      top: 100%;
      border-radius: 8px 8px 16px 16px;
    }

    &--above {
      bottom: 100%;
      border-radius: 16px 16px 8px 8px;
    }

    &__empty {
      padding: 16px;
      color: $text-secondary;
    }
  }
}
</style>
