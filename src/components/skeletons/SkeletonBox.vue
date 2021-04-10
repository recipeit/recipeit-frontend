<template>
  <div class="skeleton-box" />
</template>

<script>
export default {}
</script>

<style lang="scss">
.skeleton-box {
  position: relative;
  background-color: var(--color-image-background);
  height: 1em;
  overflow: hidden;

  // &--dark {
  //   background-color: var(--background-);
  // }

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg, transparent, var(--color-text-secondary), transparent);
    background-size: 100vw 100vh;
    background-attachment: fixed;
    background-position-x: -100vw;
    background-repeat: no-repeat;
    animation: loading 1s infinite;
    opacity: 0.1;
  }

  @keyframes loading {
    100% {
      background-position-x: 100vw;
    }
  }
}
</style>
