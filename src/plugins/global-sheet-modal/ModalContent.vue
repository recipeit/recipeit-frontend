<template>
  <div class="sheet-modal-content">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SheetModalContent'
})
</script>

<style lang="scss" scoped>
.sheet-modal-content {
  background-color: var(--color-background);
  border-radius: 32px 32px 0 0;
  position: relative;

  @media (min-width: 721px) {
    border-radius: 32px;
  }

  &::before {
    position: absolute;
    height: 4px;
    width: 48px;
    border-radius: 8px;
    background-color: var(--color-border);
    top: 12px;
    left: 50%;
    transform: translateX(-50%);

    @media (max-width: 720px) {
      content: '';
    }
  }
}
</style>
