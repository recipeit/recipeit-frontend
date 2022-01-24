<template>
  <div>
    <div
      ref="select"
      :class="['base-select', { 'base-select--focus': opened, 'base-select--multiple': multiple }]"
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
        <span v-if="showSelectedValue && !multiple" class="base-select__field__value">
          <slot name="label" :option="value">
            {{ label ? value[label] : value }}
          </slot>
        </span>
        <template v-else-if="multiple" class="test-multiselect-pills">
          <BaseButton
            v-for="singleValue in value"
            :key="trackBy ? singleValue[trackBy] : singleValue"
            subtle
            class="test-multiselect-pill"
            color="primary"
            size="small"
            @click="selectOption(singleValue)"
          >
            {{ label ? singleValue[label] : value }}
            <BaseIcon class="test-multiselect-pill-close" icon="close" weight="semi-bold" />
          </BaseButton>
          <span v-if="multiPlaceholder && showSelectedValue" class="multi-placeholder">{{ multiPlaceholder }}</span>
        </template>
        <template v-if="searchable">
          <input
            v-show="opened"
            ref="search"
            :value="search"
            class="base-select__field__input"
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
        <BaseIcon class="base-select__field__open-indicator" icon="angle-left" weight="semi-bold" />
      </div>
      <transition name="fade">
        <div
          v-show="opened"
          ref="options"
          :class="['base-select__options', { 'base-select__options--above': isAbove }]"
          :style="{ maxHeight: optimizedHeight + 'px' }"
          @mousedown.prevent
        >
          <ul v-if="filteredOptionsLimited && filteredOptionsLimited.length > 0" class="base-select__options__list">
            <li
              v-for="(option, index) in filteredOptionsLimited"
              :key="option"
              :class="{
                'base-select__options__list__item': true,
                'base-select__options__list__item--selected': isOptionSelected(option),
                'base-select__options__list__item--highlight': index === pointer,
                'base-select__options__list__item--label': option.isLabel
              }"
              v-on="
                option.isLabel
                  ? {}
                  : {
                      mouseenter: e => e.currentTarget === e.target && pointerSet(index),
                      click: () => selectOption(option)
                    }
              "
            >
              <slot v-if="option.isLabel" name="groupLabel" :label="option['groupLabel']">
                {{ option['groupLabel'] }}
              </slot>
              <slot v-else name="option" :option="option" :search="search" :index="index">
                {{ label ? option[label] : option }}
              </slot>
            </li>
            <li
              v-if="filteredOptions && filteredOptions.length > filteredOptionsLimited.length"
              class="base-select__options__list__others-item"
            >
              i {{ filteredOptions.length - filteredOptionsLimited.length }} innnych opcji
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
        <ul :id="erorrsID" class="base-select__errors__list">
          <li v-for="(error, i) in errors" :key="i">{{ $t(`errorCode.${error}`) }}</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
import sortby from 'lodash.sortby'
import { nextTick } from 'vue'

import { setFocus } from '@/directives/autofocus'

import uniqueID from '@/functions/uniqueID'

const isEmpty = opt => {
  if (opt === 0) return false
  if (Array.isArray(opt) && opt.length === 0) return true
  return !opt
}

const normalizePolishString = value =>
  value
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ż/g, 'z')
    .replace(/ź/g, 'z')

const includes = (str, query) => {
  if (!query) return true

  const valueNormalizedString = normalizePolishString(str.toLowerCase())
  const queryNormalizedString = normalizePolishString(query.trim().toLowerCase())

  return valueNormalizedString.includes(queryNormalizedString)
}

const OPEN_DIRECTIONS = {
  ABOVE: 'above',
  BELOW: 'below'
}

export default {
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
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number
    },
    value: {
      type: [String, Object],
      default: null
    },
    options: {
      type: Array,
      required: true
    },
    groupLabel: String,
    groupValues: String,
    trackBy: {
      type: String
    },
    searchBy: {
      type: String
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    multiPlaceholder: {
      type: String
    },
    maxHeight: {
      type: Number,
      default: 210
    },
    defaultOpenDirection: {
      type: String,
      validator: value => Object.values(OPEN_DIRECTIONS).includes(value),
      default: OPEN_DIRECTIONS.BELOW
    },
    customLabel: {
      type: Function,
      default(option, label) {
        if (isEmpty(option)) return ''
        return label ? option[label] : option
      }
    },

    autofocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change', 'blur', 'focus'],
  data: component => ({
    search: '',
    opened: false,
    preferredOpenDirection: component.defaultOpenDirection,
    optimizedHeight: component.maxHeight,
    pointer: null,
    id: 'base-select-' + uniqueID().getID()
  }),
  computed: {
    erorrsID() {
      return `${this.id}-errors`
    },
    isGrouped() {
      return this.groupLabel && this.groupValues
    },
    placeholderAsLabel() {
      if (this.multiple) {
        return this.searchable
          ? this.opened || (this.value !== null && this.value.length > 0)
          : this.value !== null && this.value.length > 0
      }
      return this.searchable ? this.opened || this.value !== null : this.value !== null
    },
    showSelectedValue() {
      if (this.multiple) {
        return this.searchable ? !this.opened && this.value !== null && this.value.length > 0 : this.value !== null && this.value.length > 0
      }
      return this.searchable ? !this.opened && this.value !== null : this.value !== null
    },
    filteredOptions() {
      if (!this.searchable || !this.search) {
        return this.isGrouped ? this.plainOptions(this.options) : this.options
      } else if (this.isGrouped) {
        const filteredGroups = this.options.map(group => {
          const filteredValues = this.filterOptions(group[this.groupValues])
          return filteredValues.length > 0
            ? {
                [this.groupLabel]: group[this.groupLabel],
                [this.groupValues]: filteredValues
              }
            : []
        })

        if (!this.formattedSearch) return this.plainOptions(filteredGroups)

        const sortedFilteredGroups = sortby(filteredGroups, group => {
          const options = group && !Array.isArray(group) ? group[this.groupValues] : null
          return options?.some(option =>
            this.optionSearchableValue(option)
              .toLowerCase()
              .includes(this.formattedSearch)
          )
            ? 0
            : 1
        })

        return this.plainOptions(sortedFilteredGroups)
      } else {
        return this.filterOptions(this.options)
      }
    },
    filteredOptionsLimited() {
      if (this.limit) {
        let limit = this.limit
        if (this.filteredOptions && this.filteredOptions[limit - 1]?.isLabel) {
          limit++
        }
        return this.filteredOptions?.slice(0, limit)
      }
      return this.filteredOptions
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
      return this.preferredOpenDirection === OPEN_DIRECTIONS.ABOVE
      // }
    },
    formattedSearch() {
      return this.search?.toLowerCase() || this.search
    }
  },
  watch: {
    filteredOptionsLimited() {
      this.pointerAdjust()
      this.scrollOptionsToTop()
    },
    options() {
      // TODO multiple
      // TODO grouped
      if (this.multiple) {
        // if (this.value) {
        //   const newValue = this.value.filter(o => this.options.includes(this.value))
        //   this.$emit('change', newList)
        // }
      } else {
        if (this.value && !this.options.includes(this.value)) {
          this.selectOption(null)
        }
      }
    }
  },
  mounted() {
    if (this.autofocus) {
      this.setFocus()
    }
  },
  methods: {
    setFocus() {
      setFocus(this.$refs.select)
    },
    isOptionSelected(option) {
      const { getKeyFromValue, value } = this
      const optionKey = getKeyFromValue(option)

      if (this.multiple) {
        const index = value?.findIndex(v => getKeyFromValue(v) === optionKey)
        return index >= 0
      } else {
        return optionKey === getKeyFromValue(value)
      }
    },
    getKeyFromValue(value) {
      const { trackBy } = this
      if (trackBy) {
        return value ? value[trackBy] : null
      }
      return value
    },
    async addPointerElement() {
      if (this.filteredOptionsLimited.length > 0) {
        await this.selectOption(this.filteredOptionsLimited[this.pointer])
      } else {
        await this.hide()
      }
    },
    pointerForward() {
      if (this.pointer !== null && this.pointer < this.filteredOptionsLimited.length - 1) {
        this.pointer++
      } else {
        this.pointer = 0
      }

      //RISKY TODO
      if (this.filteredOptionsLimited[this.pointer].isLabel) {
        this.pointer++
      }
      // /* istanbul ignore else */
      // if (this.pointer < this.filteredOptionsLimited.length - 1) {
      //   this.pointer++
      //   /* istanbul ignore next */
      //   if (this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight) {
      //     this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight
      //   }
      //   /* istanbul ignore else */
      //   if (this.filteredOptionsLimited[this.pointer] && this.filteredOptionsLimited[this.pointer].$isLabel && !this.groupSelect)
      //     this.pointerForward()
      // }
      // this.pointerDirty = true
    },
    pointerBackward() {
      if (this.pointer !== null && this.pointer > 0) {
        this.pointer--
      } else {
        this.pointer = this.filteredOptionsLimited.length - 1
      }

      //RISKY TODO
      if (this.filteredOptionsLimited[this.pointer].isLabel) {
        this.pointer--

        if (this.pointer < 0) {
          this.pointer = this.filteredOptionsLimited.length - 1
        }
      }
      // if (this.pointer > 0) {
      //   this.pointer--
      //   /* istanbul ignore else */
      //   if (this.$refs.list.scrollTop >= this.pointerPosition) {
      //     this.$refs.list.scrollTop = this.pointerPosition
      //   }
      //   /* istanbul ignore else */
      //   if (this.filteredOptionsLimited[this.pointer] && this.filteredOptionsLimited[this.pointer].$isLabel && !this.groupSelect)
      //     this.pointerBackward()
      // } else {
      //   /* istanbul ignore else */
      //   if (this.filteredOptionsLimited[this.pointer] && this.filteredOptionsLimited[0].$isLabel && !this.groupSelect) this.pointerForward()
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
      if (this.pointer >= this.filteredOptionsLimited.length - 1) {
        this.pointer = this.filteredOptionsLimited.length ? this.filteredOptionsLimited.length - 1 : 0
      }
    },

    updateSearch(query) {
      this.search = query
    },
    async open() {
      if (this.opened) return

      this.opened = true
      this.adjustPosition()

      await nextTick()

      this.scrollOptionsToTop()
      if (this.searchable) {
        this.$refs.search?.focus()
      } else {
        this.$refs.select?.focus()
      }
      this.$emit('focus')
    },
    async hide() {
      if (!this.opened) return

      this.opened = false
      this.pointerReset()

      // TODO gdzieś błąd z tym, że po zaznaczeniu wartości, menu się chowa, ale dalej gdzieś zostaje focus

      await nextTick()
      if (this.searchable) {
        this.$refs.search?.blur()
      } else {
        this.$refs.select?.blur()
      }
      this.$emit('blur')
    },
    async selectOption(newValue) {
      if (!this.multiple) {
        await this.hide()
      }

      const { value, getKeyFromValue } = this

      if (this.multiple) {
        const newSelectedKey = getKeyFromValue(newValue)
        const index = value?.findIndex(v => getKeyFromValue(v) === newSelectedKey)

        if (index >= 0) {
          const newList = [...value]
          newList.splice(index, 1)
          this.$emit('change', newList)
        } else {
          this.$emit('change', [...value, newValue])
        }
      } else {
        let selectCurrentSelected = value ? getKeyFromValue(newValue) === getKeyFromValue(value) : null

        this.$emit('change', selectCurrentSelected ? null : newValue)
      }

      if (this.searchable) {
        this.search = ''
      }
    },
    adjustPosition() {
      if (typeof window === 'undefined') return

      const spaceAbove = this.$el.getBoundingClientRect().top
      const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom
      const hasEnoughSpaceBelow = spaceBelow > this.maxHeight

      if (
        hasEnoughSpaceBelow ||
        spaceBelow > spaceAbove ||
        this.openDirection === OPEN_DIRECTIONS.BELOW ||
        this.openDirection === 'bottom'
      ) {
        this.preferredOpenDirection = OPEN_DIRECTIONS.BELOW
        this.optimizedHeight = Math.min(spaceBelow - 40, this.maxHeight)
      } else {
        this.preferredOpenDirection = OPEN_DIRECTIONS.ABOVE
        this.optimizedHeight = Math.min(spaceAbove - 40, this.maxHeight)
      }
    },
    plainOptions(options) {
      return options.flatMap(group =>
        group[this.groupValues]?.length > 0 ? [{ groupLabel: group[this.groupLabel], isLabel: true }, ...group[this.groupValues]] : []
      )
    },
    optionSearchableValue(option) {
      return this.searchBy ? option[this.searchBy] : this.customLabel(option, this.label)
    },
    filterOptions(options) {
      const { formattedSearch, optionSearchableValue } = this
      const result = options.filter(option => includes(optionSearchableValue(option), this.search))

      if (!formattedSearch) return result

      return sortby(result, [
        option =>
          optionSearchableValue(option)
            .toLowerCase()
            .includes(formattedSearch)
            ? 0
            : 1,
        option => optionSearchableValue(option).length,
        option => optionSearchableValue(option)
      ])
    },
    scrollOptionsToTop() {
      if (this.$refs.options) {
        this.$refs.options.scrollTop = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.multi-placeholder {
  margin: 2px;
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  display: flex;
  height: 24px;
  align-items: center;
  line-height: 14px;
}

.test-multiselect-pills {
  margin: -2px;
  padding: 12px 0 6px 0;
  padding-right: 1.5rem;
}

.test-multiselect-pill {
  height: 24px;
  padding: 0 12px;
  line-height: 14px;
  margin: 2px;

  &-close {
    margin-left: 4px;
    margin-right: -4px;
    font-size: 0.875rem;
  }

  // &:last-of-type {
  //   margin-right: 8px;
  // }
}

.base-select {
  $root: &;

  position: relative;

  &__field {
    position: relative;
    min-height: 48px;
    border-bottom: 2px solid var(--color-border);
    overflow: hidden;
    font-size: 0.875rem;
    cursor: pointer;
    @include transition((border-color));
    display: flex;
    flex-wrap: wrap;
    padding: 14px 1.5rem 4px 0;
    align-items: center;

    &:hover {
      border-color: var(--color-border-hover);
    }

    #{ $root }--focus & {
      border-color: var(--color-primary);
    }

    &__placeholder {
      position: absolute;
      height: 48px;
      top: 0;
      display: flex;
      align-items: center;
      color: var(--color-text-secondary);
      // transform-origin: top left;
      @include transition((height, font-size, color, opacity, visibility));

      &--small {
        height: 12px;
        font-size: 12px;
        // color: var(--color-text-primary);
        // font-weight: bold;
        // transform: scale(0.75);

        #{ $root }--multiple & {
          opacity: 0;
          visibility: hidden;
        }
      }
    }

    &__input {
      display: block;
      // height: 48px;
      height: 24px;
      display: flex;
      align-items: center;
      // margin-top: 6px;
      border: none;
      color: inherit;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      padding: 0;
      margin: 2px;
      line-height: 14px;
      // padding-top: 6px;
      // width: 100%;
      min-width: 128px;
      flex: 1;
      box-sizing: border-box;
      background: transparent;
    }

    &__value {
      box-sizing: border-box;
      width: 100%;
      // display: block;
      min-height: 24px;
      display: flex;
      align-items: center;
      line-height: 14px;
      // padding-top: 6px;
      // margin-top: 6px;
    }

    &__open-indicator {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 48px;
      width: 1rem;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      padding: 14px 0 4px 0;

      ::v-deep(svg) {
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
    min-width: 100%;
    background-color: var(--color-background-flyout);
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    overflow: hidden;
    overflow: auto;
    font-size: 14px;
    line-height: 20px;

    @include scrollbar(transparent);

    &__list {
      margin: 8px 0;

      &__others-item {
        padding: 8px 16px;
        color: var(--color-text-secondary);
      }

      &__item {
        @include transition((background-color));
        padding: 8px 16px;
        cursor: pointer;

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

        &--label {
          position: sticky;
          top: 0;
          background-color: var(--color-background-flyout);
          font-size: 0.75rem;
          font-weight: bold;
          color: var(--color-text-secondary);
          margin-top: 0.25rem;
          cursor: initial;
        }
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
