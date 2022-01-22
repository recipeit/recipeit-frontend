<template>
  <Modal
    v-for="modal in modals"
    :key="modal.id"
    :opened="modal.opened"
    :block-close-on-backdrop="modal.blockCloseOnBackdrop"
    @close="close(modal.id)"
    @closed="afterModalTransitionLeave(modal.id)"
  >
    <component :is="modal.component" v-bind="modal.props" v-on="modal.events" @close="close(modal.id)" />
  </Modal>
</template>

<script>
import Modal from '@/plugins/global-sheet-modal/Modal.vue'
import { nextId } from '@/plugins/global-sheet-modal/utils'

export default {
  name: 'GlobalSheetModalContainer',
  components: {
    Modal
  },
  data: () => ({
    modals: []
  }),
  computed: {
    anyModalOpened() {
      return this.modals.filter(m => m.opened).length > 0
    },
    anyModalOpenedOrClosing() {
      return this.modals.length > 0
    }
  },
  watch: {
    anyModalOpenedOrClosing(value) {
      const scrollWidth = window.innerWidth - document.body.offsetWidth
      const bodyRequireScroll = document.body.scrollHeight > document.body.clientHeight
      document.body.style.overflowY = value ? 'hidden' : null
      document.body.style.paddingRight = value && bodyRequireScroll ? `${scrollWidth}px` : null
    }
  },
  created() {
    this.$modal._setGlobalModalContainer(this)
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27 && this.anyModalOpened) {
        const opened = this.modals.filter(m => m.opened)
        const modal = opened[opened.length - 1]
        if (!modal.blockCloseOnBackdrop) {
          this.$modal.hide(opened[opened.length - 1].id)
        }
      }
    })
  },
  methods: {
    add(component, props = {}, events = {}, { blockCloseOnBackdrop } = {}) {
      const id = nextId()
      this.modals.push({
        id: id,
        opened: false,
        component: component,
        props: props,
        events: events,
        blockCloseOnBackdrop: !!blockCloseOnBackdrop
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
  }
}
</script>

<style lang="scss" scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
