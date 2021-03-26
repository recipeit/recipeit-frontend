<template>
  <transition-group name="toast-list" tag="div" class="toasts-container">
    <div class="toasts-container__item" v-for="toast in toasts" :key="toast.id">
      <Toast
        :message="toast.message"
        :type="toast.type"
        :id="toast.id"
        :seconds="toast.seconds"
        :cancellable="toast.cancellable"
        :cancelCallback="toast.onCancel"
        @hide="removeToast(toast.id)"
      ></Toast>
    </div>
  </transition-group>
</template>

<script>
import uniqueID from '@/functions/uniqueID'
import Toast from './Toast'

export default {
  name: 'toasts-container',
  components: {
    Toast
  },
  data() {
    return {
      toasts: []
    }
  },
  methods: {
    appendToast(message, type, seconds) {
      this.toasts.push({ id: uniqueID().getID(), message, type, seconds })
    },
    appendCancellableToast(message, type, seconds, cancelCallback) {
      this.toasts.push({ id: uniqueID().getID(), message, type, seconds, cancellable: true, onCancel: cancelCallback })
    },
    removeToast(id) {
      const index = this.toasts.findIndex(v => v.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    }
  },
  created() {
    this.$toast._setGlobalToastsContainer(this)
  }
}
</script>

<style lang="scss" scoped>
.toasts-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 10000;

  &__item {
    padding: 0 1rem 1rem 1rem;
    width: 100%;
    @include transition(all);
  }
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(128px);
}

.toast-list-leave-active {
  position: absolute;
}
</style>
