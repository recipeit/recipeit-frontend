<template>
  <Modal v-for="modal in modals" :key="modal.id" :opened="modal.opened" @closed="afterModalTransitionLeave(modal.id)">
    <component :is="modal.component" v-bind="modal.props" v-on="modal.events" @close="close(modal.id)" />
  </Modal>
  <!-- <div v-for="modal in modals" :key="modal.id">
    <transition name="modal-fade" mode="out-in" @after-leave="afterModalTransitionLeave(modal.id)">
      <div
        v-if="modal.opened"
        :class="['global-sheet-modal-container', { show: true }]"
        @mousedown.self="close(modal.id)"
        @touchstart.self="close(modal.id)"
      >
        <div
          :key="modal.id"
          v-if="modal"
          class="global-sheet-modal"
          @mousedown.self="close(modal.id)"
          @touchstart.self="close(modal.id)"
        >
          <component :is="modal.component" v-bind="modal.props" v-on="modal.events" @close="close" />
        </div>
      </div>
    </transition>
  </div> -->
</template>

<script>
import Modal from './Modal'
import { nextId } from './utils'

export default {
  name: 'global-sheet-modal-container',
  data() {
    return {
      modals: []
    }
  },
  components: {
    Modal
  },
  computed: {
    anyModalOpened() {
      return this.modals && this.modals.filter(m => m.opened).length > 0
    }
  },
  methods: {
    add(component, props = {}, events = {}) {
      const id = nextId()
      this.modals.push({
        id: id,
        opened: false,
        component: component,
        props: props,
        events: events
      })
      this.$nextTick(() => {
        this.open(id)
      })
    },
    remove(id) {
      const index = this.modals.findIndex(v => v.id === id)
      if (index !== -1) {
        this.modals[index].opened = false
      }
    },
    open(id) {
      const index = this.modals.findIndex(v => v.id === id)
      if (index !== -1) {
        this.modals[index].opened = true
      }
    },
    close(id) {
      this.$modal.hide(id)
    },
    afterModalTransitionLeave(id) {
      const index = this.modals.findIndex(v => v.id === id)
      if (index !== -1) {
        this.modals.splice(index, 1)
      }
    }
  },
  created() {
    this.$modal._setGlobalModalContainer(this)
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27 && this.anyModalOpened) {
        const opened = this.modals.filter(m => m.opened)
        this.$modal.hide(opened[opened.length - 1].id)
      }
    })
  }
}
</script>

<style lang="scss">
$transition-length: 0.3s ease;

.global-sheet-modal-container {
  z-index: 1000;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  outline: 0;
  background: rgba(#f2f5f7, 0.75);
  overflow-y: auto;
  transition: all $transition-length;

  &:not(.show) {
    opacity: 0;
    visibility: hidden;
  }

  .global-sheet-modal {
    $margin-y: 16px;
    $margin-x: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: $margin-y $margin-x;
    min-height: calc(100% - #{$margin-y * 2});
  }
}

// .modal-fade-enter-active,
// .modal-fade-leave-active {
//   transition: all $transition-length;
// }

// .modal-fade-enter,
// .modal-fade-leave-active {
//   opacity: 0;
//   transform: scale(0.95);
// }

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from {
  // transform: translateX(8px);
}
.modal-fade-leave-to {
  // transform: translateX(-8px);
}
</style>
