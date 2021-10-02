<template>
  <transition name="spinner-fade">
    <span v-if="show" class="spinner-container">
      <span :class="['spinner', `spinner--color-${color}`]" />
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

<style lang="scss" scoped>
$border-size: 0.25em;
$spinner-size: 2em;

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
  position: relative;
  font-size: 10px;
  width: $spinner-size;
  height: $spinner-size;
  line-height: 0;
  display: inline-block;

  .spinner {
    display: inline-block;
    position: absolute;
    right: 0;
    transform: translateZ(0);
    animation: load8 1s infinite linear;
    width: 2em;
    height: 2em;

    &:after,
    &:before {
      content: '';
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      box-sizing: border-box;
    }

    &:before {
      border: $border-size solid currentColor;
      opacity: 0.15;
    }

    &:after {
      border: $border-size solid transparent;
      border-top-color: currentColor;
    }

    &--color-primary:after {
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
}
</style>
