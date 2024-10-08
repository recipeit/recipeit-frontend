<template>
  <div :class="['toast', `toast--${type}`]" @mouseenter="resetTimer()" @mouseleave="setTimer()">
    <BaseIcon class="toast__icon" :icon="icon" weight="bold" />
    <div class="toast__message">
      {{ message }}
    </div>
    <BaseLink v-if="!cancellable" tag="button" class="toast__close" color="text-secondary" @click="hide()">
      <BaseIcon icon="close" weight="semi-bold" />
    </BaseLink>
    <BaseLink v-else tag="button" class="toast__cancel" color="primary" @click="cancel()"> cofnij </BaseLink>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'

import { ToastType } from './typings'

export default defineComponent({
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String as PropType<ToastType>,
      default: 'info'
    },
    message: {
      type: String,
      required: true
    },
    seconds: {
      type: Number,
      default: 5
    },
    cancellable: Boolean,
    cancelCallback: Function
  },

  emits: ['hide'],

  setup(props, { emit }) {
    // data
    const data = reactive({ timer: null })

    // computed
    const icon = computed(() => {
      switch (props.type) {
        case 'success':
          return 'small-check'
        case 'warning':
          return 'warning'
        case 'error':
          return 'small-close'
        default:
          return 'info'
      }
    })

    // methods
    const hide = () => {
      emit('hide')
    }

    const setTimer = () => {
      if (data.timer) {
        resetTimer()
      }

      data.timer = setTimeout(() => {
        hide()
      }, props.seconds * 1000)
    }

    const resetTimer = () => {
      clearTimeout(data.timer)
      data.timer = null
    }

    const cancel = () => {
      props.cancelCallback?.()
      hide()
    }

    onMounted(() => {
      setTimer()
    })

    return {
      // data
      ...toRefs(data),
      // computed
      icon,
      // methods
      hide,
      setTimer,
      resetTimer,
      cancel
    }
  }
})
</script>

<style lang="scss" scoped>
.toast {
  $root: &;

  pointer-events: initial;
  padding: 0.75rem;
  border-radius: 1.75rem;
  color: var(--color-toast-color);
  background-color: var(--color-toast-background);
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: flex-start;
  max-width: 512px;
  margin-left: auto;

  &__message {
    flex: 1;
  }

  &__cancel {
    padding-right: 0.5rem !important;
    height: 22px;
  }

  &__message,
  &__cancel {
    padding-top: 2px !important;
  }

  &__icon,
  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    height: 24px;
    width: 24px;
  }

  &__icon {
    font-size: 1rem;
    color: var(--color-toast-icon-color);
    background-color: var(--color-toast-icon-background);
    border-radius: 24px;
    margin-right: 0.5rem;

    #{$root}--success & {
      color: var(--color-toast-icon-success-color);
      background-color: var(--color-toast-icon-success-background);
    }

    #{$root}--warning & {
      color: var(--color-toast-icon-warning-color);
      background-color: var(--color-toast-icon-warning-background);
    }

    #{$root}--error & {
      color: var(--color-toast-icon-error-color);
      background-color: var(--color-toast-icon-error-background);
    }
  }
}
</style>
