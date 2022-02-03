<template>
  <transition-group name="toast-list" tag="div" class="toasts-container">
    <div v-for="toast in toasts" :key="toast.id" class="toasts-container__item">
      <Toast
        :id="toast.id"
        :message="toast.message"
        :type="toast.type"
        :seconds="toast.seconds"
        :cancellable="toast.cancellable"
        :cancel-callback="toast.onCancel"
        @hide="removeToast(toast.id)"
      />
    </div>
  </transition-group>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

import uniqueID from '@/functions/uniqueID'

import Toast from '@/plugins/toast/Toast.vue'

import { IToastContainer, ToastInstance } from './typings'

export default defineComponent({
  name: 'ToastsContainer',

  components: {
    Toast
  },

  setup() {
    // data
    const data = reactive({
      toasts: [] as Array<ToastInstance>
    })

    // methods
    const appendToast: IToastContainer['appendToast'] = (message, type, seconds) => {
      data.toasts.push({ id: uniqueID().getID(), message, type, seconds })
    }

    const appendCancellableToast: IToastContainer['appendCancellableToast'] = (message, type, seconds, cancelCallback) => {
      data.toasts.push({ id: uniqueID().getID(), message, type, seconds, cancellable: true, onCancel: cancelCallback })
    }

    const removeToast: IToastContainer['removeToast'] = id => {
      const index = data.toasts.findIndex(v => v.id === id)
      if (index !== -1) {
        data.toasts.splice(index, 1)
      }
    }

    return {
      // data
      ...toRefs(data),
      // methods
      appendToast,
      appendCancellableToast,
      removeToast
    } as IToastContainer
  },

  created() {
    this.$toast._setGlobalToastsContainer(this)
  }
})
</script>

<style lang="scss" scoped>
.toasts-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 10000;

  @media (max-width: 720px) {
    margin-bottom: 80px;
  }

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
