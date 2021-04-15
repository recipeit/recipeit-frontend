<template>
  <div class="sheet-modal-content">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'sheet-modal-content'
}
</script>

<style lang="scss">
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
