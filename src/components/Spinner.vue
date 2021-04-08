<template>
  <transition name="spinner-fade">
    <span v-if="show" class="spinner-container">
      <span :class="['spinner', `spinner--color-${color}`]"></span>
    </span>
  </transition>
</template>

<script>
export default {
  props: {
    show: Boolean,
    color: String
  }
}
</script>

<style lang="scss">
:root {
  // --spinner-background: rgba(255, 255, 255, 0.2);
  // --spinner-color: #fff;
  --spinner-background: #{rgba(darken(#272c30, 5), 0.2)};
  --spinner-color: #{darken(#272c30, 5)};
}

.spinner-fade {
  &-enter-active,
  &-leave-active {
    @include transition((opacity, width));
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    width: 0 !important;
  }
}

.spinner-container {
  font-size: 10px;
  width: calc(2em + 0.75rem);
  line-height: 0;
  display: inline-block;
  text-align: left;
}

.spinner {
  display: inline-block;
  position: relative;
  border: 0.25em solid var(--spinner-background);
  border-top-color: var(--spinner-color);
  transform: translateZ(0);
  animation: load8 1s infinite linear;

  &,
  &:after {
    border-radius: 50%;
    width: 2em;
    height: 2em;
  }

  &--color-text-primary {
    border-color: var(--color-text-secondary);
    border-top-color: var(--color-text-primary);
  }

  &--color-primary {
    border-color: transparent;
    border-top-color: var(--color-primary);
  }
}

@keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
