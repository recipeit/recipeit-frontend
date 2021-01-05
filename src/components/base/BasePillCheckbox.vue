<template>
  <div :class="['pill', { 'pill--checked': isChecked }, { 'pill--red': excluding }]" @click="updateInput">
    <BaseIcon v-if="excluding" class="pill__checked-icon" icon="close" weight="semiBold" />
    <BaseIcon v-else class="pill__checked-icon" icon="check" weight="semiBold" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    excluding: { type: Boolean },
    value: { type: String },
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
$checked-color: $blue;
$checked-color--red: $red;
$checked-icon-size: 1rem;
$checked-icon-margin-right: 0.5rem;
$checked-icon-width: $checked-icon-size + $checked-icon-margin-right;

.pill {
  border: 1px solid $border;
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
    border-color: darken($border, 15%);
  }

  &--checked {
    border-color: transparent;
    background-color: rgba($checked-color, 0.1);
    color: $checked-color;

    &:hover {
      background-color: rgba($checked-color, 0.2);
    }
  }

  &--checked#{ & }--red {
    background-color: rgba($checked-color--red, 0.1);
    color: $checked-color--red;

    &:hover {
      background-color: rgba($checked-color--red, 0.2);
    }
  }

  &__checked-icon {
    font-size: $checked-icon-size;
    width: $checked-icon-width;
    color: $checked-color;
    transition: all 0.2s ease;
  }

  &--red &__checked-icon {
    color: $checked-color--red;
  }

  &:not(&--checked) &__checked-icon {
    opacity: 0;
    margin-left: -$checked-icon-width;
  }
}
</style>
