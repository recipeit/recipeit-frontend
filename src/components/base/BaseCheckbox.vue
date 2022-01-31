<template>
  <div
    v-blur-on-click
    :tabindex="tabindex"
    :class="['checkbox', { 'checkbox--checked': checked, 'checkbox--focus': focused }]"
    @click="updateInput()"
    @focus="setFocus()"
    @blur="setBlur()"
    @keypress.enter.prevent.stop.self="updateInput()"
  >
    <div class="checkbox__input">
      <BaseIcon icon="small-check" weight="bold" />
    </div>
    <div class="checkbox__label">
      <slot name="label">
        <span class="checkbox__label__content">{{ label }}</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue'

import { CheckboxValue } from '@/typings/checkbox'

export default defineComponent({
  props: {
    value: {
      type: [Boolean, String, Number] as PropType<CheckboxValue>
    },
    modelValue: {
      type: [Boolean, String, Number] as PropType<Array<CheckboxValue> | CheckboxValue>,
      default: ''
    },
    label: { type: String },
    trueValue: {
      type: [Boolean, String, Number] as PropType<CheckboxValue>,
      default: true
    },
    falseValue: {
      type: [Boolean, String, Number] as PropType<CheckboxValue>,
      default: false
    },
    tabindex: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    // data
    const data = reactive({
      focused: false
    })

    // computed
    const checked = computed(() => {
      if (props.modelValue instanceof Array) {
        return props.modelValue.includes(props.value)
      }
      return props.modelValue === props.trueValue
    })

    // methods
    const setFocus = () => {
      if (data.focused) return
      data.focused = true
    }

    const setBlur = () => {
      if (!data.focused) return
      data.focused = false
    }

    const updateInput = () => {
      if (props.disabled) return

      const newChecked = !checked.value
      if (props.modelValue instanceof Array) {
        let newValue = [...props.modelValue]
        if (newChecked) {
          newValue.push(props.value)
        } else {
          newValue.splice(newValue.indexOf(props.value), 1)
        }
        emit('update:modelValue', newValue)
      } else {
        emit('update:modelValue', newChecked ? props.trueValue : props.falseValue)
      }
    }

    return {
      // data
      ...toRefs(data),
      // computed
      checked,
      // methods
      setFocus,
      setBlur,
      updateInput
    }
  }
})
</script>

<style lang="scss" scoped>
.checkbox {
  $root: &;

  display: flex;
  cursor: pointer;

  &__input {
    position: relative;
    min-width: 16px;
    width: 16px;
    height: 16px;
    font-size: 16px;
    margin: 3px 0;
    margin-right: 16px;
    border: 2px solid var(--color-border);
    color: transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include transition((border-color, color));

    @include cursor-only {
      #{ $root }:hover &,
      #{ $root }--focus & {
        border-color: var(--color-border-hover);
      }
    }

    #{ $root }:active & {
      border-color: var(--color-border-active);
    }

    #{ $root }--checked & {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    @include cursor-only {
      #{ $root }--checked:hover &,
      #{ $root }--checked#{ $root }--focus & {
        border-color: var(--color-primary-lighter);
        color: var(--color-primary-lighter);
      }
    }

    #{ $root }--checked:active & {
      border-color: var(--color-primary-lightest);
      color: var(--color-primary-lightest);
    }
  }

  &__label {
    line-height: 22px;
    font-size: 14px;
  }
}
</style>
