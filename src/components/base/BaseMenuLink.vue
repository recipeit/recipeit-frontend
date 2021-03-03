<template>
  <BaseLink class="base-menu-link" :color="color">
    <slot></slot>
  </BaseLink>
</template>

<script>
import BaseLink from './BaseLink.vue'
export default {
  props: {
    color: String
  },
  components: { BaseLink }
}
</script>

<style lang="scss" scoped>
.base-menu-link {
  font-size: 0.875rem;
  white-space: nowrap;
  padding: 8px 16px;
  display: block;
  @include transition((color, background-color));

  &:hover {
    // background-color: var(--color-border);
  }
}
</style>
