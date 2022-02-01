<template>
  <div class="animated-icon" :class="{ animate: show }">
    <div class="add-animation-icon">
      <slot />
    </div>
    <div class="add-animation" @animationend="onAnimationEnd($event)">
      <div class="add-animation-circle">
        <svg class="add-animation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10.5">
          <polyline class="add-animation-path" points="1.5 5.5 5 9 12.5 1.5" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const show = ref(false)

    const onAnimationEnd = ({ target }) => {
      if (target.classList.contains('add-animation')) {
        show.value = false
      }
    }

    const startAnimation = () => {
      if (!show.value) {
        show.value = true
      }
    }

    return {
      show,
      onAnimationEnd,
      startAnimation
    }
  }
})
</script>

<style lang="scss" scoped>
.animated-icon {
  position: relative;

  &.animate {
    .add-animation {
      animation: add-move 2s ease alternate 1;
    }

    .add-animation-icon {
      animation: add-shake 2s ease alternate 1;
    }

    .add-animation-circle {
      animation: add-zoom 2s ease alternate 1;
    }

    .add-animation-path {
      animation: add-dash 2s ease alternate 1;
    }
  }

  .add-animation {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }

  .add-animation-circle {
    width: 24px;
    height: 24px;
    background-color: var(--color-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0);
  }

  .add-animation-svg {
    width: 10px;
  }

  .add-animation-path {
    fill: none;
    stroke: var(--color-background);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3px;
    stroke-dasharray: 30;
    stroke-dashoffset: 0;
  }

  @keyframes add-shake {
    65% {
      transform: rotate(0deg);
    }
    70% {
      transform: rotate(25deg);
    }
    80% {
      transform: rotate(-25deg);
    }
    90% {
      transform: rotate(12deg);
    }
    100% {
      transform: rotate(0);
    }
  }

  @keyframes add-move {
    0% {
      transform: translate(-50%, -150%);
    }
    60% {
      transform: translate(-50%, -150%);
    }
    80% {
      transform: translate(-50%, -50%);
    }
  }

  @media (min-width: 721px) {
    @keyframes add-move {
      0% {
        transform: translate(-150%, -50%);
      }
      60% {
        transform: translate(-150%, -50%);
      }
      80% {
        transform: translate(-50%, -50%);
      }
    }
  }

  @keyframes add-zoom {
    0% {
      transform: scale(0);
    }
    20% {
      transform: scale(1);
    }
    60% {
      transform: scale(1);
    }
    80% {
      transform: scale(0);
    }
  }

  @keyframes add-dash {
    0% {
      stroke-dashoffset: 30;
    }
    15% {
      stroke-dashoffset: 30;
    }
    50% {
      stroke-dashoffset: 0;
    }
  }
}
</style>
