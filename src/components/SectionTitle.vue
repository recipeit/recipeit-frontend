<template>
  <div :class="{ 'section-title': true, 'section-title--large': size === 'large' }">
    <BaseIcon v-if="!!icon" class="section-title-icon" :icon="icon" />
    <slot name="title">
      {{ title }}
    </slot>
    <BaseLink v-if="showAction" class="section-title-link" tag="button" color="primary" @click="$emit('action-click')">
      {{ actionText }}
    </BaseLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const sizes = ['regular', 'large']

export default defineComponent({
  props: {
    icon: String,
    title: String,
    showAction: {
      type: Boolean,
      default: false
    },
    actionText: String,
    size: {
      type: String,
      validator: (value: string) => !value || sizes.includes(value)
    }
  },

  emits: ['action-click']
})
</script>

<style lang="scss" scoped>
.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  display: flex;
  align-items: center;

  &-link {
    margin-left: auto;
    font-size: 12px;
  }

  &-icon {
    margin-right: 0.5rem;
    font-size: 1.5rem;
    color: var(--color-primary);
  }

  &--large {
    font-size: 1rem;
  }
}
</style>
