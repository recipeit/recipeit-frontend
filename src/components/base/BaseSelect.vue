<template>
  <div>
    <div
      ref="select"
      :class="['base-select', { 'base-select--focus': opened }]"
      :tabindex="searchable ? -1 : 0"
      @focus="open()"
      @blur="searchable ? false : hide()"
      @keyup.esc.stop="hide()"
      @keydown.self.down.prevent="pointerForward()"
      @keydown.self.up.prevent="pointerBackward()"
      @keypress.enter.tab.stop.self="addPointerElement()"
    >
      <div :class="['base-select__field', { 'base-select__field--selected': value !== null }]">
        <span :class="['base-select__field__placeholder', { 'base-select__field__placeholder--small': placeholderAsLabel }]">
          {{ placeholder }}
        </span>
        <template v-if="searchable">
          <input
            v-show="opened"
            :value="search"
            class="base-select__field__input"
            ref="search"
            tabindex="0"
            @change.stop
            @input.stop="updateSearch($event.target.value)"
            @focus.prevent="open()"
            @blur.prevent="hide()"
            @keyup.esc.stop="hide()"
            @keydown.down.prevent="pointerForward()"
            @keydown.up.prevent="pointerBackward()"
            @keypress.enter.prevent.stop.self="addPointerElement()"
          />
        </template>
        <span v-if="showSelectedValue" class="base-select__field__value">
          <slot name="label" :option="value">
            {{ label ? value[label] : value }}
          </slot>
        </span>
        <BaseIcon class="base-select__field__open-indicator" icon="angle-left" weight="semi-bold" />
      </div>
      <transition name="fade">
        <div
          v-show="opened"
          @mousedown.prevent
          :class="['base-select__options', { 'base-select__options--above': isAbove }]"
          :style="{ maxHeight: optimizedHeight + 'px' }"
        >
          <ul class="base-select__options__list" v-if="filteredOptions && filteredOptions.length > 0">
            <li
              v-for="(option, index) in filteredOptions"
              :key="option"
              :class="{
                'base-select__options__list__item': true,
                'base-select__options__list__item--selected': getKeyFromValue(option) === getKeyFromValue(value),
                'base-select__options__list__item--highlight': index === pointer
              }"
            >
              <div class="base-select__options__list__group-label" v-if="option.isLabel">
                <slot name="groupLabel" :label="option['groupLabel']">
                  {{ option['groupLabel'] }}
                </slot>
              </div>
              <div v-else @mouseenter.self="pointerSet(index)" @click="selectOption(option)">
                <slot name="option" :option="option" :search="search" :index="index">
                  {{ label ? option[label] : option }}
                </slot>
              </div>
            </li>
          </ul>
          <div v-else class="base-select__options__empty">
            Brak pasujących elementów
          </div>
        </div>
      </transition>
    </div>
    <div v-if="errors && errors.length > 0" class="base-select__errors">
      <slot name="errors">
        <ul class="base-select__errors__list" :id="erorrsID">
          <li v-for="(error, i) in errors" :key="i">{{ $t(`errorCode.${error}`) }}</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
import uniqueID from '@/functions/uniqueID'
import { nextTick } from 'vue'

function isEmpty(opt) {
  if (opt === 0) return false
  if (Array.isArray(opt) && opt.length === 0) return true
  return !opt
}

function includes(str, query) {
  /* istanbul ignore else */
  if (!query) return true
  return str.toLowerCase().includes(query.toLowerCase())
  // if (str === undefined) str = 'undefined'
  // if (str === null) str = 'null'
  // if (str === false) str = 'false'
  // const text = str.toString().toLowerCase()
  // return text.indexOf(query.trim()) !== -1
}

export default {
  emits: ['change', 'blur', 'focus'],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    errors: Array,
    searchable: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number
    },
    value: { default: null },
    options: {
      type: Array,
      required: true
    },
    groupLabel: String,
    groupValues: String,
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
    },
    customLabel: {
      type: Function,
      default(option, label) {
        if (isEmpty(option)) return ''
        return label ? option[label] : option
      }
    }
  },
  data: component => ({
    search: '',
    opened: false,
    preferredOpenDirection: 'below',
    optimizedHeight: component.maxHeight,
    pointer: null,
    id: 'base-select-' + uniqueID().getID()
  }),
  methods: {
    getKeyFromValue(value) {
      const { trackBy } = this
      if (trackBy) {
        return value ? value[trackBy] : null
      }
      return value
    },
    async addPointerElement() {
      if (this.filteredOptions.length > 0) {
        await this.selectOption(this.filteredOptions[this.pointer])
      } else {
        await this.hide()
      }
    },
    pointerForward() {
      if (this.pointer !== null && this.pointer < this.filteredOptions.length - 1) {
        this.pointer++
      } else {
        this.pointer = 0
      }

      //RISKY TODO
      if (this.filteredOptions[this.pointer].isLabel) {
        this.pointer++
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
        this.pointer = this.filteredOptions.length - 1
      }

      //RISKY TODO
      if (this.filteredOptions[this.pointer].isLabel) {
        this.pointer--

        if (this.pointer < 0) {
          this.pointer = this.filteredOptions.length - 1
        }
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
      if (this.pointer >= this.filteredOptions.length - 1) {
        this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0
      }
    },

    updateSearch(query) {
      this.search = query
    },
    open() {
      if (this.opened) return

      this.opened = true
      this.adjustPosition()

      this.$nextTick(() => {
        if (this.searchable) {
          this.$refs.search && this.$refs.search.focus()
        } else {
          this.$refs.select && this.$refs.select.focus()
        }
        this.$emit('focus')
      })
    },
    async hide() {
      if (!this.opened) return

      this.opened = false
      this.pointerReset()

      // TODO gdzieś błąd z tym, że po zaznaczeniu wartości, menu się chowa, ale dalej gdzieś zostaje focus

      // this.$nextTick(() => {
      await nextTick()
      if (this.searchable) {
        this.$refs.search && this.$refs.search.blur()
      } else {
        this.$refs.select && this.$refs.select.blur()
      }
      this.$emit('blur')
      // })
    },
    async selectOption(newValue) {
      await this.hide()

      const { value, getKeyFromValue } = this
      let selectCurrentSelected = value ? getKeyFromValue(newValue) === getKeyFromValue(value) : null

      this.$emit('change', selectCurrentSelected ? null : newValue)
      if (this.searchable) {
        this.search = ''
      }
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
    },
    plainOptions(options) {
      return options.flatMap(group =>
        group[this.groupValues]?.length > 0 ? [{ groupLabel: group[this.groupLabel], isLabel: true }, ...group[this.groupValues]] : []
      )
    },
    filterOptions(options) {
      return options.filter(option => includes(this.customLabel(option, this.label), this.search))
    }
  },
  computed: {
    erorrsID() {
      return `${this.id}-errors`
    },
    isGrouped() {
      return this.groupLabel && this.groupValues
    },
    placeholderAsLabel() {
      return this.searchable ? this.opened || this.value !== null : this.value !== null
    },
    showSelectedValue() {
      return this.searchable ? !this.opened && this.value !== null : this.value !== null
    },
    filteredOptions() {
      if (!this.searchable || !this.search) return this.isGrouped ? this.plainOptions(this.options) : this.options
      else if (this.isGrouped) {
        const filteredGroups = this.options.map(group => {
          const filteredValues = this.filterOptions(group[this.groupValues])
          return filteredValues.length > 0
            ? {
                [this.groupLabel]: group[this.groupLabel],
                [this.groupValues]: filteredValues
              }
            : []
        })
        return this.plainOptions(filteredGroups)
      } else {
        return this.filterOptions(this.options)
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
    filteredOptions() {
      this.pointerAdjust()
    },
    options() {
      if (this.value && !this.options.includes(this.value)) {
        this.selectOption(null)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  $root: &;

  position: relative;

  &__field {
    position: relative;
    height: 48px;
    border-bottom: 2px solid var(--color-border);
    overflow: hidden;
    font-size: 0.875rem;
    cursor: pointer;
    @include transition((border-color));

    &:hover {
      border-color: var(--color-border-hover);
    }

    #{ $root }--focus & {
      border-color: var(--color-primary);
    }

    &__placeholder {
      position: absolute;
      height: 48px;
      display: flex;
      align-items: center;
      color: var(--color-text-secondary);
      // transform-origin: top left;
      @include transition((height, font-size, color));

      &--small {
        height: 12px;
        font-size: 12px;
        // color: var(--color-text-primary);
        // font-weight: bold;
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
      color: inherit;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      padding: 0;
      padding-top: 6px;
      width: 100%;
      box-sizing: border-box;
      background: transparent;
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

    &__open-indicator {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 1rem;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;

      & ::v-deep(svg) {
        transform: rotate(-90deg);
        @include transition(transform);

        #{ $root }--focus & {
          transform: rotate(90deg);
        }
      }
    }

    // &--selected &__placeholder {
    //   height: 12px;
    //   font-size: 12px;
    //   color: var(--color-text-primary);
    //   font-weight: bold;
    //   // transform: scale(0.75);
    // }
  }

  &__options {
    position: absolute;
    left: 0;
    right: 0;
    background-color: var(--color-background-flyout);
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
          // color: var(--color-primary);
          // background-color: rgba($black, 0.05); //TODO
          background-color: var(--color-button-subtle-contrast-background);
        }

        &--selected {
          font-weight: bold;
          color: var(--color-primary);

          &:hover {
            // color: var(--color-primary);
            background-color: var(--color-button-subtle-primary-background);
          }
        }
      }

      &__group-label {
        font-size: 0.75rem;
        font-weight: bold;
        color: var(--color-text-secondary);
        margin-top: 0.25rem;
        cursor: initial;
      }
    }

    &:not(&--above) {
      top: 100%;
      border-radius: 0px 0px 16px 16px;
    }

    &--above {
      bottom: 100%;
      border-radius: 16px 16px 8px 8px;
    }

    &__empty {
      padding: 16px;
      color: var(--color-text-secondary);
    }
  }

  &__errors {
    &__list {
      margin-top: 6px;
      font-size: 0.75rem;
      text-align: left;
      color: var(--color-red);

      li {
        padding: 2px 0;
      }
    }
  }
}
</style>
