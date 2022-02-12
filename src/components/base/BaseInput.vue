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
        :tabindex="tabindex"
        :placeholder="placeholder"
        :value="value"
        :disabled="disabled"
        :aria-describedby="errors ? erorrsID : null"
        :aria-invalid="errors ? true : null"
        @focus.stop="setFocus()"
        @blur.stop="setBlur()"
      />
    </div>
    <div v-if="errors" class="base-input__errors">
      <slot name="errors">
        <ul :id="erorrsID" class="base-input__errors__list">
          <li v-for="(error, i) in errors" :key="i">{{ $t(`errorCode.${error}`) }}</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue'

import uniqueID from '@/functions/uniqueID'

export default defineComponent({
  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    value: {
      type: [String, Number],
      default: null
    },
    errors: Array as PropType<Array<string>>,
    placeholder: String,
    label: String,
    type: {
      type: String,
      default: 'text',
      validator: (prop: string) => ['text', 'number', 'password'].includes(prop)
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
        'base-input--invalid': props.errors && props.errors.length > 0,
        'base-input--disabled': props.disabled
      }
    })

    const erorrsID = computed(() => {
      return `${data.id}-errors`
    })

    const hasValue = computed(() => {
      const stringValue = props.value?.toString()
      if (stringValue === null) return false
      if (stringValue === undefined) return false
      if (stringValue === '') return false
      return true
    })

    // methods
    const setFocus = () => {
      data.focused = true
      emit('focus')
    }

    const setBlur = () => {
      data.focused = false
      emit('blur')
    }

    return {
      // data
      ...toRefs(data),
      // computed
      baseInputClasses,
      erorrsID,
      hasValue,
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
