<template>
  <div v-blur-on-click :class="['pill', { 'pill--checked': isChecked }, { 'pill--red': excluding }]" @click="updateInput">
    <BaseIcon v-if="excluding" class="pill__checked-icon" icon="close" weight="semi-bold" />
    <BaseIcon v-else class="pill__checked-icon" icon="check" weight="semi-bold" />
    <slot />
  </div>
</template>

<script>
export default {
  emits: ['update:modelValue'],
  props: {
    excluding: { type: Boolean },
    value: { type: [String, Number] },
    modelValue: { default: '' },
    label: { type: String },
    trueValue: { default: true },
    falseValue: { default: false }
  },
  computed: {
    isChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value)
      }
      // Note that `true-value` and `false-value` are camelCase in the JS
      return this.modelValue === this.trueValue
    }
  },
  methods: {
    updateInput() {
      let isChecked = !this.isChecked
      if (this.modelValue instanceof Array) {
        let newValue = [...this.modelValue]
        if (isChecked) {
          newValue.push(this.value)
        } else {
          newValue.splice(newValue.indexOf(this.value), 1)
        }
        this.$emit('update:modelValue', newValue)
      } else {
        this.$emit('update:modelValue', isChecked ? this.trueValue : this.falseValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$checked-icon-size: 1rem;
$checked-icon-margin-right: 0.5rem;
$checked-icon-width: $checked-icon-size + $checked-icon-margin-right;

.pill {
  border: 1px solid var(--color-border);
  border-radius: 48px;
  padding: 4px 16px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  &:not(&--checked):hover {
    border-color: var(--color-border-hover);
  }

  &:not(&--checked):active {
    border-color: var(--color-border-active);
  }

  &--checked {
    border-color: transparent;
    background-color: var(--color-button-subtle-primary-background);
    color: var(--color-button-subtle-primary-color);

    &:hover {
      background-color: var(--color-button-subtle-primary-background-hover);
    }

    &:active {
      background-color: var(--color-button-subtle-primary-background-active);
    }
  }

  &--checked#{ & }--red {
    background-color: var(--color-button-subtle-danger-background);
    color: var(--color-button-subtle-danger-color);

    &:hover {
      background-color: var(--color-button-subtle-danger-background-hover);
    }

    &:active {
      background-color: var(--color-button-subtle-danger-background-active);
    }
  }

  &__checked-icon {
    font-size: $checked-icon-size;
    width: $checked-icon-width;
    color: var(--color-button-subtle-primary-color);
    transition: all 0.2s ease;
  }

  &--red &__checked-icon {
    color: var(--color-button-subtle-danger-color);
  }

  &:not(&--checked) &__checked-icon {
    opacity: 0;
    margin-left: -$checked-icon-width;
  }
}
</style>
