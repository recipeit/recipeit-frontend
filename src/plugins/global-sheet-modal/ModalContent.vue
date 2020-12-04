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
  // max-width: 512px;
  // width: 100%;
  // background: white;
  // border-radius: 8px;
  // box-shadow: 0 4px 32px rgba(0, 0, 0, 0.06);

  // .modal-header,
  // .modal-body,
  // .modal-footer {
  //   padding: 16px;
  // }

  // > * + * {
  //   padding-top: 0 !important;
  // }
  height: 100%;
  position: relative;
  overflow: hidden;

  &__inner {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 1;
    padding: 32px;
  }
}
</style>
