<template>
  <BaseLink class="base-menu-link" :color="color">
    <slot />
  </BaseLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import BaseLink from '@/components/base/BaseLink.vue'

export default defineComponent({
  components: { BaseLink },

  props: {
    color: String
  }
})
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
