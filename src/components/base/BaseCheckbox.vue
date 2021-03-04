<template>
  <div :class="['checkbox', { 'checkbox--checked': checked }]" @click="updateInput">
    <div class="checkbox__input">
      <BaseIcon icon="checkSmall" weight="bold" />
    </div>
    <div class="checkbox__label">
      <slot name="label">
        <span class="checkbox__label__content">{{ label }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: [String, Number] },
    modelValue: { default: '' },
    label: { type: String },
    trueValue: { default: true },
    falseValue: { default: false }
  },
  computed: {
    checked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value)
      }
      return this.modelValue === this.trueValue
    }
  },
  methods: {
    updateInput() {
      let checked = !this.checked
      if (this.modelValue instanceof Array) {
        let newValue = [...this.modelValue]
        if (checked) {
          newValue.push(this.value)
        } else {
          newValue.splice(newValue.indexOf(this.value), 1)
        }
        this.$emit('update:modelValue', newValue)
      } else {
        this.$emit('update:modelValue', checked ? this.trueValue : this.falseValue)
      }
    }
  }
}
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

    #{ $root }:hover & {
      border-color: var(--color-border-hover);
    }

    #{ $root }:active & {
      border-color: var(--color-border-active);
    }

    #{ $root }--checked & {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    #{ $root }--checked:hover & {
      border-color: var(--color-primary-lighter);
      color: var(--color-primary-lighter);
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
