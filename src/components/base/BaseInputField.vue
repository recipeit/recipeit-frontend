<template>
  <div :class="baseInputClasses">
    <div class="base-input__control">
      <label :for="id" :class="[{ 'label-up': hasValue || focused }]">
        <slot name="label">{{ label }}</slot>
      </label>
      <input
        :id="id"
        v-autofocus="autofocus"
        :type="type"
        :inputmode="inputmode"
        :tabindex="tabindex"
        :placeholder="placeholder"
        :value="inputValue"
        :disabled="disabled"
        :aria-describedby="errorList ? erorrsID : null"
        :aria-invalid="errorList ? true : null"
        @focus.stop="setFocus($event)"
        @blur.stop="setBlur($event)"
        @input="handleChange($event)"
      />
    </div>
    <div v-if="errorList?.length > 0" class="base-input__errors">
      <slot name="errors">
        <ul :id="erorrsID" class="base-input__errors__list">
          <li v-for="(error, i) in errorList" :key="i">{{ $t(`errorCode.${error}`) }}</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { computed, defineComponent, InputHTMLAttributes, PropType, reactive, toRefs } from 'vue'

import uniqueID from '@/functions/uniqueID'

type InputFieldType = 'text' | 'number' | 'password'

const nonValueOptions = [null, undefined, '']

export default defineComponent({
  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: String,
    label: String,
    type: {
      type: String as PropType<InputFieldType>,
      default: 'text'
    },
    inputmode: {
      type: String as PropType<InputHTMLAttributes['inputmode']>,
      default: null
    },
    tabindex: {
      type: Number,
      default: 0
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: ['focus', 'blur'],

  setup(props, { emit }) {
    // usings
    const {
      value: inputValue,
      errors,
      handleBlur,
      handleChange,
      meta
    } = useField(props.name, undefined, {
      initialValue: props.value
    })

    // data
    const data = reactive({
      focused: false,
      id: 'base-input-' + uniqueID().getID()
    })

    // computed
    const baseInputClasses = computed(() => {
      return {
        'base-input': true,
        'base-input--focus': data.focused,
        'base-input--invalid': errors.value?.length > 0,
        'base-input--disabled': props.disabled
      }
    })

    const erorrsID = computed(() => {
      return `${data.id}-errors`
    })

    const hasValue = computed(() => {
      const stringValue = inputValue.value?.toString()
      if (nonValueOptions.includes(stringValue)) return false
      return true
    })

    const errorList = computed(() => {
      return meta.touched ? errors.value : null
    })

    // methods
    const setFocus = (event: FocusEvent) => {
      data.focused = true
      emit('focus', event)
    }

    const setBlur = (event: FocusEvent) => {
      data.focused = false
      handleBlur(event)
      emit('blur', event)
    }

    return {
      // usings
      handleChange,
      inputValue,
      // data
      ...toRefs(data),
      // computed
      baseInputClasses,
      erorrsID,
      hasValue,
      errorList,
      // methods
      setFocus,
      setBlur
    }
  }
})
</script>

<style lang="scss" scoped>
.base-input {
  $root: &;

  color: var(--color-text-primary);

  &--disabled {
    color: var(--color-text-secondary);
  }

  &__control {
    position: relative;
    font-size: 0.875rem;

    label {
      top: 0;
      position: absolute;
      line-height: 46px;
      color: var(--color-text-secondary);
      pointer-events: none;
      @include transition((color, line-height, font-weight, font-size));

      &.label-up {
        line-height: 12px;
        font-size: 12px;
        // color: var(--color-text-primary);
        // font-weight: bold;
      }
    }

    input {
      height: 48px;
      border: none;
      padding: 8px 0 0 0;
      border-bottom: 2px solid var(--color-border);
      color: inherit;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      width: 100%;
      min-width: 0;
      background: transparent;
      @include transition((border-color, color));

      #{ $root }:not(#{ $root }--disabled) &:hover {
        border-color: var(--color-border-hover);
      }

      #{ $root }--focus:not(#{ $root }--disabled) & {
        border-color: var(--color-primary);
      }

      #{ $root }--invalid & {
        border-color: var(--color-red);
      }
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
