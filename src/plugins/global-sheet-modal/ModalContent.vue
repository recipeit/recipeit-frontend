<template>
  <div class="global-sheet-modal-content">
    <div class="global-sheet-modal-content__inner">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'global-sheet-modal-content'
}
</script>

<style lang="scss">
.global-sheet-modal-content {
  background: #fff;
  border-radius: 32px 32px 0 0;
  position: relative;

  &__inner {
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    padding: 32px;
  }
}
</style>
