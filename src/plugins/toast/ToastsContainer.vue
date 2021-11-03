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

<script>
import uniqueID from "@/src/functions/uniqueID";

import Toast from "@/src/plugins/toast/Toast";

export default {
  name: "ToastsContainer",
  components: {
    Toast,
  },
  data() {
    return {
      toasts: [],
    };
  },
  created() {
    this.$toast._setGlobalToastsContainer(this);
  },
  methods: {
    appendToast(message, type, seconds) {
      this.toasts.push({ id: uniqueID().getID(), message, type, seconds });
    },
    appendCancellableToast(message, type, seconds, cancelCallback) {
      this.toasts.push({
        id: uniqueID().getID(),
        message,
        type,
        seconds,
        cancellable: true,
        onCancel: cancelCallback,
      });
    },
    removeToast(id) {
      const index = this.toasts.findIndex((v) => v.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },
  },
};
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
