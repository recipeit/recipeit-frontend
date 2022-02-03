<template>
  <div ref="mainElement">
    <div
      ref="selectElement"
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
        <template v-else-if="multiple">
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
            ref="searchElement"
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
          ref="optionsElement"
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
              <slot v-if="option.isLabel" name="groupLabel" :label="option.label">
                {{ option.label }}
              </slot>
              <slot v-else name="option" :option="option.option" :search="search" :index="index">
                {{ option.label }}
              </slot>
            </li>
            <li
              v-if="filteredOptions && filteredOptions.length > filteredOptionsLimited.length"
              class="base-select__options__list__others-item"
            >
              i {{ filteredOptions.length - filteredOptionsLimited.length }} innnych opcji
            </li>
          </ul>
          <div v-else class="base-select__options__empty">Brak pasujących elementów</div>
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

<script lang="ts">
import sortby from 'lodash.sortby'
import { computed, defineComponent, nextTick, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue'

import { setFocus as setFocusDirective } from '@/directives/autofocus'

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

type SingleOption = string | number | object

type LabelOption = {
  groupLabel: string
  isLabel: true
}

type GroupedOption = {
  groupLabel: string
  groupValues: Array<SingleOption>
  // [key: string]: string | Array<SingleOption>
}

type FilteredOption = {
  isLabel: boolean
  label: string
  option?: SingleOption
}

export default defineComponent({
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    errors: {
      type: Array as PropType<Array<string>>
    },
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
      type: [String, Number, Object, Array] as PropType<SingleOption | Array<SingleOption>>,
      default: null
    },
    options: {
      type: Array as PropType<Array<SingleOption | GroupedOption>>,
      required: true
    },
    grouped: {
      type: Boolean
    },
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
      validator: (value: string) => Object.values(OPEN_DIRECTIONS).includes(value),
      default: OPEN_DIRECTIONS.BELOW
    },
    customLabel: {
      type: Function as PropType<(option: SingleOption, label?: string) => string>
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },

  emits: ['change', 'blur', 'focus'],

  setup(props, { emit }) {
    // refs
    const mainElement = ref(null)
    const selectElement = ref(null)
    const searchElement = ref(null)
    const optionsElement = ref(null)

    // data
    const data = reactive({
      search: '',
      opened: false,
      preferredOpenDirection: props.defaultOpenDirection,
      optimizedHeight: props.maxHeight,
      pointer: null as number,
      id: 'base-select-' + uniqueID().getID()
    })

    // internal computed

    // computed
    const erorrsID = computed(() => {
      return `${data.id}-errors`
    })

    // const isGrouped = computed(() => {
    //   return !!props.groupLabel && !!props.groupValues
    // })

    const placeholderAsLabel = computed(() => {
      if (props.multiple && Array.isArray(props.value)) {
        return props.searchable
          ? data.opened || (props.value !== null && props.value.length > 0)
          : props.value !== null && props.value.length > 0
      }
      return props.searchable ? data.opened || props.value !== null : props.value !== null
    })

    const showSelectedValue = computed(() => {
      if (props.multiple && Array.isArray(props.value)) {
        return props.searchable
          ? !data.opened && props.value !== null && props.value.length > 0
          : props.value !== null && props.value.length > 0
      }
      return props.searchable ? !data.opened && props.value !== null : props.value !== null
    })

    const filteredOptions = computed((): Array<FilteredOption> => {
      if (!props.searchable || !data.search) {
        return props.grouped
          ? plainOptions(props.options as Array<GroupedOption>)
          : props.options.map(option => ({ isLabel: false, label: props.label ? option[props.label] : option, option }))
      } else if (props.grouped) {
        const filteredGroups = props.options
          .map((group: GroupedOption): GroupedOption => {
            const filteredValues = filterOptions(group.groupValues as Array<SingleOption>)
            return filteredValues.length > 0
              ? {
                  groupLabel: group.groupLabel,
                  groupValues: filteredValues
                }
              : null
          })
          .filter(group => group)

        if (!formattedSearch.value) return plainOptions(filteredGroups)

        const sortedFilteredGroups = sortby(filteredGroups, group => {
          const options = group && !Array.isArray(group) ? (group.groupValues as Array<SingleOption>) : null
          return options?.some(option => optionSearchableValue(option).toLowerCase().includes(formattedSearch.value)) ? 0 : 1
        })

        return plainOptions(sortedFilteredGroups)
      } else {
        return filterOptions(props.options).map(option => ({ isLabel: false, label: props.label ? option[props.label] : option, option }))
      }
    })

    const filteredOptionsLimited = computed(() => {
      if (props.limit) {
        let limit = props.limit
        if (filteredOptions.value?.[limit - 1]?.isLabel) {
          limit++
        }
        return filteredOptions.value?.slice(0, limit)
      }
      return filteredOptions.value
    })

    const isAbove = computed(() => {
      // if (this.openDirection === 'above' || this.openDirection === 'top') {
      //   return true
      // } else if (
      //   this.openDirection === 'below' ||
      //   this.openDirection === 'bottom'
      // ) {
      //   return false
      // } else {
      return data.preferredOpenDirection === OPEN_DIRECTIONS.ABOVE
      // }
    })

    const formattedSearch = computed(() => {
      return data.search?.toLowerCase() || data.search
    })

    // internal methods

    // methods
    const getCustomLabel = (option: SingleOption, label?: string): string => {
      if (props.customLabel) {
        return props.customLabel(option, label)
      }

      if (isEmpty(option)) return ''
      return label ? option[label] : option
    }

    const setFocus = () => {
      setFocusDirective(selectElement.value)
    }

    const isOptionSelected = (option: SingleOption) => {
      const optionKey = getKeyFromValue(option)

      if (props.multiple && Array.isArray(props.value)) {
        const index = props.value?.findIndex(v => getKeyFromValue(v) === optionKey)
        return index >= 0
      } else {
        return optionKey === getKeyFromValue(props.value)
      }
    }

    const getKeyFromValue = (value: SingleOption): string => {
      if (props.trackBy) {
        return value ? value[props.trackBy] : null
      }
      return value as string
    }

    const addPointerElement = async () => {
      if (filteredOptionsLimited.value.length > 0) {
        await selectOption(filteredOptionsLimited.value[data.pointer])
      } else {
        await hide()
      }
    }

    const pointerForward = () => {
      if (data.pointer !== null && data.pointer < filteredOptionsLimited.value.length - 1) {
        data.pointer++
      } else {
        data.pointer = 0
      }

      //RISKY TODO
      if (filteredOptionsLimited.value[data.pointer].isLabel) {
        data.pointer++
      }
      // /* istanbul ignore else */
      // if (data.pointer < filteredOptionsLimited.value.length - 1) {
      //   this.pointer++
      //   /* istanbul ignore next */
      //   if (this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight) {
      //     this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight
      //   }
      //   /* istanbul ignore else */
      //   if (filteredOptionsLimited.value[this.pointer] && filteredOptionsLimited.value[this.pointer].$isLabel && !this.groupSelect)
      //     this.pointerForward()
      // }
      // this.pointerDirty = true
    }

    const pointerBackward = () => {
      if (data.pointer !== null && data.pointer > 0) {
        data.pointer--
      } else {
        data.pointer = filteredOptionsLimited.value.length - 1
      }

      //RISKY TODO
      if (filteredOptionsLimited.value[data.pointer].isLabel) {
        data.pointer--

        if (data.pointer < 0) {
          data.pointer = filteredOptionsLimited.value.length - 1
        }
      }
      // if (data.pointer > 0) {
      //   data.pointer--
      //   /* istanbul ignore else */
      //   if (this.$refs.list.scrollTop >= this.pointerPosition) {
      //     this.$refs.list.scrollTop = this.pointerPosition
      //   }
      //   /* istanbul ignore else */
      //   if (filteredOptionsLimited.value[this.pointer] && filteredOptionsLimited.value[this.pointer].$isLabel && !this.groupSelect)
      //     this.pointerBackward()
      // } else {
      //   /* istanbul ignore else */
      //   if (filteredOptionsLimited.value[this.pointer] && filteredOptionsLimited.value[0].$isLabel && !this.groupSelect) this.pointerForward()
      // }
      // this.pointerDirty = true
    }

    const pointerReset = () => {
      data.pointer = null
      // /* istanbul ignore else */
      // if (!this.closeOnSelect) return
      // data.pointer = 0
      // /* istanbul ignore else */
      // if (this.$refs.list) {
      //   this.$refs.list.scrollTop = 0
      // }
    }

    const pointerSet = (index: number) => {
      data.pointer = index
    }

    const pointerAdjust = () => {
      if (data.pointer >= filteredOptionsLimited.value.length - 1) {
        data.pointer = filteredOptionsLimited.value.length ? filteredOptionsLimited.value.length - 1 : 0
      }
    }

    const updateSearch = (query: string) => {
      data.search = query
    }

    const open = async () => {
      if (data.opened) return

      data.opened = true
      adjustPosition()

      await nextTick()

      scrollOptionsToTop()
      if (props.searchable) {
        searchElement.value?.focus()
      } else {
        selectElement.value?.focus()
      }
      emit('focus')
    }

    const hide = async () => {
      if (!data.opened) return

      data.opened = false
      pointerReset()

      // TODO gdzieś błąd z tym, że po zaznaczeniu wartości, menu się chowa, ale dalej gdzieś zostaje focus

      await nextTick()
      if (props.searchable) {
        searchElement.value?.blur()
      } else {
        selectElement.value?.blur()
      }
      emit('blur')
    }

    const selectOption = async newValue => {
      if (!props.multiple) {
        await hide()
      }

      if (props.multiple && Array.isArray(props.value)) {
        const newSelectedKey = getKeyFromValue(newValue)
        const index = props.value?.findIndex(v => getKeyFromValue(v) === newSelectedKey)

        if (index >= 0) {
          const newList = [...props.value]
          newList.splice(index, 1)
          emit('change', newList)
        } else {
          emit('change', [...props.value, newValue])
        }
      } else {
        let selectCurrentSelected = props.value ? getKeyFromValue(newValue) === getKeyFromValue(props.value) : null

        emit('change', selectCurrentSelected ? null : newValue)
      }

      if (props.searchable) {
        data.search = ''
      }
    }

    const adjustPosition = () => {
      if (typeof window === 'undefined') return

      const spaceAbove = mainElement.value.getBoundingClientRect().top
      const spaceBelow = window.innerHeight - mainElement.value.getBoundingClientRect().bottom
      const hasEnoughSpaceBelow = spaceBelow > props.maxHeight

      if (
        hasEnoughSpaceBelow ||
        spaceBelow > spaceAbove
        // this.openDirection === OPEN_DIRECTIONS.BELOW ||
        // this.openDirection === 'bottom'
      ) {
        data.preferredOpenDirection = OPEN_DIRECTIONS.BELOW
        data.optimizedHeight = Math.min(spaceBelow - 40, props.maxHeight)
      } else {
        data.preferredOpenDirection = OPEN_DIRECTIONS.ABOVE
        data.optimizedHeight = Math.min(spaceAbove - 40, props.maxHeight)
      }
    }

    const plainOptions = (options: Array<GroupedOption>): Array<FilteredOption> => {
      return options.flatMap(
        (group): Array<FilteredOption> =>
          group.groupValues?.length > 0
            ? [
                { label: group.groupLabel, isLabel: true },
                ...group.groupValues.map(option => ({ isLabel: false, label: props.label ? option[props.label] : option, option }))
              ]
            : []
      )
    }

    const optionSearchableValue2 = (option: FilteredOption): string => {
      return props.searchBy ? option[props.searchBy] : getCustomLabel(option.option, props.label)
    }

    const optionSearchableValue = (option: SingleOption): string => {
      console.log(option)
      return props.searchBy ? option[props.searchBy] : getCustomLabel(option, props.label)
    }

    const filterOptions = (options: Array<SingleOption>) => {
      // const { formattedSearch, optionSearchableValue } = this
      const result = options.filter(option => includes(optionSearchableValue(option), data.search))

      if (!formattedSearch.value) return result

      return sortby(result, [
        option => (optionSearchableValue(option).toLowerCase().includes(formattedSearch.value) ? 0 : 1),
        option => optionSearchableValue(option).length,
        option => optionSearchableValue(option)
      ])
    }

    const scrollOptionsToTop = () => {
      if (optionsElement.value) {
        optionsElement.value.scrollTop = 0
      }
    }

    // watchers
    watch(filteredOptionsLimited, () => {
      pointerAdjust()
      scrollOptionsToTop()
    })

    watch(
      () => props.options,
      () => {
        // TODO multiple
        // TODO grouped
        if (props.multiple) {
          // if (props.value) {
          //   const newValue = props.value.filter(o => props.options.includes(props.value))
          //   emit('change', newList)
          // }
        } else {
          if (props.value && !props.options.includes(props.value)) {
            selectOption(null)
          }
        }
      }
    )

    // lifecycle hooks
    onMounted(() => {
      if (props.autofocus) {
        setFocus()
      }
    })

    return {
      // refs
      mainElement,
      selectElement,
      searchElement,
      optionsElement,
      // data
      ...toRefs(data),
      // computed
      erorrsID,
      // isGrouped,
      placeholderAsLabel,
      showSelectedValue,
      filteredOptions,
      filteredOptionsLimited,
      isAbove,
      formattedSearch,
      // methods
      setFocus,
      isOptionSelected,
      getKeyFromValue,
      addPointerElement,
      pointerForward,
      pointerBackward,
      pointerReset,
      pointerSet,
      pointerAdjust,
      updateSearch,
      open,
      hide,
      selectOption,
      adjustPosition,
      plainOptions,
      optionSearchableValue,
      filterOptions,
      scrollOptionsToTop
    }
  }
})
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

// .test-multiselect-pills {
//   margin: -2px;
//   padding: 12px 0 6px 0;
//   padding-right: 1.5rem;
// }

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
