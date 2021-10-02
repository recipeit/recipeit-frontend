<template>
  <div class="message-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.message-container {
  position: fixed;
  bottom: 1rem;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 11000;
  display: flex;
  flex-direction: column;
  align-items: center;

  // @media (min-width: 721px) {
  //   bottom: 1rem;
  // }
}
</style>
