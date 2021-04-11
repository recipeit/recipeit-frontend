<template>
  <div
    :class="[
      'base-input',
      { 'base-input--focus': focused, 'base-input--invalid': errors && errors.length > 0, 'base-input--disabled': disabled }
    ]"
  >
    <div class="base-input__control">
      <label :for="id" :class="[{ 'label-up': hasValue || focused }]">
        <slot name="label">{{ label }}</slot>
      </label>
      <input
        :id="id"
        :type="type"
        :tabindex="tabindex"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :aria-describedby="errors ? erorrsID : null"
        :aria-invalid="errors ? true : null"
        v-autofocus="autofocus"
        v-bind="field"
        @focus="setFocus()"
        @blur="setBlur()"
      />
    </div>
    <div v-if="errors" class="base-input__errors">
      <slot name="errors">
        <ul class="base-input__errors__list" :id="erorrsID">
          <li v-for="(error, i) in errors" :key="i">{{ $t(`errorCode.${error}`) }}</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
import uniqueID from '@/functions/uniqueID'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    },
    errors: Array,
    placeholder: String,
    label: String,
    type: {
      type: String,
      default: 'text',
      validator: prop => ['text', 'password'].includes(prop)
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
    },
    field: Object
  },
  data: () => ({
    focused: false,
    id: 'base-input-' + uniqueID().getID()
  }),
  methods: {
    valueChanged() {
      if (!this.field) {
        this.$emit('update:modelValue', event.target.value)
      }
      // if (this.input) {
      //   this.input.forEach(b => {
      //     b(event)
      //   })
      // }
    },
    setFocus() {
      this.focused = true
    },
    setBlur() {
      this.focused = false
    }
  },
  computed: {
    erorrsID() {
      return `${this.id}-errors`
    },
    hasValue() {
      const stringValue = this.field ? this.field.value?.toString() : this.modelValue?.toString()
      if (stringValue === null) return false
      if (stringValue === undefined) return false
      if (stringValue === '') return false
      return true
    }
  }
}
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
