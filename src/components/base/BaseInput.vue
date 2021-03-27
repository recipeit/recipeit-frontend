<template>
  <div :class="['base-input', { 'base-input--focus': focused, 'base-input--invalid': errors, 'base-input--disabled': disabled }]">
    <div class="base-input__control">
      <label :for="id" :class="[{ 'label-up': modelValue || focused }]">
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
        @input="valueChanged($event)"
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
    modelValue: [String, Number],
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
    }
  },
  data: () => ({
    focused: false,
    id: 'base-input-' + uniqueID().getID()
  }),
  methods: {
    valueChanged(event) {
      this.$emit('update:modelValue', event.target.value)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.base-input {
  $root: &;

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
      @include transition((border-color));

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
