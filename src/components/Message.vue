<template>
  <div class="message">
    <slot />
  </div>
</template>

<script>
// export default {

// }
</script>

<style lang="scss" scoped>
.message {
  max-width: 960px;
  // width: 100%;
  margin-left: 1rem;
  margin-right: 1rem;
  // align-items: center;
  // padding: 1.5rem;
  // display: flex;
  border-radius: 1.5rem;
  pointer-events: initial;
  // gap: 1rem;
  // backdrop-filter: saturate(1.8) blur(8px);
  // font-size: 0.75rem;
  /* font-size: 12px; */
  // background-color: rgba(var(--color-background-flyout-rgb), 0.75);

  color: var(--color-toast-color);
  background-color: var(--color-toast-background);

  & + & {
    margin-top: 1rem;
  }

  // &:last-child {
  //   border-radius: 1.5rem 1.5rem 0 0;

  //   @media (min-width: 721px) {
  //     border-radius: 1.5rem;
  //   }
  // }
}
</style>
