<template>
  <Modal
    v-for="modal in modals"
    :key="modal.id"
    :opened="modal.opened"
    @close="close(modal.id)"
    @closed="afterModalTransitionLeave(modal.id)"
  >
    <component :is="modal.component" v-bind="modal.props" v-on="modal.events" @close="close(modal.id)" />
  </Modal>
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
  watch: {
    anyModalOpened(value) {
      document.body.style.overflow = value ? 'hidden' : null
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
