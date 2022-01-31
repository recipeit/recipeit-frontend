<template>
  <div v-blur-on-click :class="['pill', { 'pill--checked': isChecked }, { 'pill--red': excluding }]" @click="updateInput()">
    <BaseIcon v-if="excluding" class="pill__checked-icon" icon="close" weight="semi-bold" />
    <BaseIcon v-else class="pill__checked-icon" icon="check" weight="semi-bold" />
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { CheckboxValue } from '@/typings/checkbox'

export default defineComponent({
  props: {
    excluding: {
      type: Boolean
    },
    value: {
      type: [Boolean, String, Number] as PropType<CheckboxValue>
    },
    modelValue: {
      type: [Array, Boolean, String, Number] as PropType<Array<CheckboxValue> | CheckboxValue>,
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
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const isChecked = computed(() => {
      if (props.modelValue instanceof Array) {
        return props.modelValue.includes(props.value)
      }
      // Note that `true-value` and `false-value` are camelCase in the JS
      return props.modelValue === props.trueValue
    })

    const updateInput = () => {
      const newIsChecked = !isChecked.value
      if (props.modelValue instanceof Array) {
        let newValue = [...props.modelValue]
        if (newIsChecked) {
          newValue.push(props.value)
        } else {
          newValue.splice(newValue.indexOf(props.value), 1)
        }
        emit('update:modelValue', newValue)
      } else {
        emit('update:modelValue', newIsChecked ? props.trueValue : props.falseValue)
      }
    }

    return {
      isChecked,
      updateInput
    }
  }
})
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
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  @include cursor-only {
    &:not(&--checked):hover,
    &:not(&--checked):focus {
      border-color: var(--color-border-hover);
    }
  }

  &:not(&--checked):active {
    border-color: var(--color-border-active);
  }

  &--checked {
    border-color: transparent;
    background-color: var(--color-button-subtle-primary-background);
    color: var(--color-button-subtle-primary-color);

    @include cursor-only {
      &:hover,
      &:focus {
        background-color: var(--color-button-subtle-primary-background-hover);
      }
    }

    &:active {
      background-color: var(--color-button-subtle-primary-background-active);
    }
  }

  &--checked#{ & }--red {
    background-color: var(--color-button-subtle-danger-background);
    color: var(--color-button-subtle-danger-color);

    @include cursor-only {
      &:hover,
      &:focus {
        background-color: var(--color-button-subtle-danger-background-hover);
      }
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
