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

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount, reactive, toRefs, watch } from 'vue'

import Modal from '@/plugins/global-sheet-modal/Modal.vue'
import { useModal } from '@/plugins/global-sheet-modal'
import { nextId } from '@/plugins/global-sheet-modal/utils'

import { IGlobalModalContainer, ModalInstance } from './typings'

export default defineComponent({
  name: 'GlobalSheetModalContainer',

  components: {
    Modal
  },

  setup(): IGlobalModalContainer {
    // usings
    const modal = useModal()

    // data
    const data = reactive({
      modals: [] as Array<ModalInstance>
    })

    // computed
    const anyModalOpened = computed(() => {
      return data.modals.some(({ opened }) => opened)
    })

    const anyModalOpenedOrClosing = computed(() => {
      return data.modals.length > 0
    })

    // methods
    const add: IGlobalModalContainer['add'] = (component, props = {}, events = {}, { blockCloseOnBackdrop = false } = {}) => {
      const id = nextId()

      data.modals.push({
        id: id,
        opened: false,
        component: component,
        props: props,
        events: events,
        blockCloseOnBackdrop: !!blockCloseOnBackdrop
      })

      nextTick(() => {
        open(id)
      })
    }

    const remove: IGlobalModalContainer['remove'] = id => {
      const foundModal = data.modals.find(v => v.id === id)
      if (foundModal) {
        foundModal.opened = false
      }
    }

    const open: IGlobalModalContainer['open'] = id => {
      const foundModal = data.modals.find(v => v.id === id)
      if (foundModal) {
        foundModal.opened = true
      }
    }

    const close: IGlobalModalContainer['close'] = id => {
      modal.hide(id)
    }

    const afterModalTransitionLeave: IGlobalModalContainer['afterModalTransitionLeave'] = id => {
      const index = data.modals.findIndex(v => v.id === id)
      if (index !== -1) {
        data.modals.splice(index, 1)
      }
    }

    const getAnyModalOpened: IGlobalModalContainer['getAnyModalOpened'] = () => anyModalOpened.value

    const getModals: IGlobalModalContainer['getModals'] = () => data.modals

    // watchers
    watch(anyModalOpenedOrClosing, value => {
      const scrollWidth = window.innerWidth - document.body.offsetWidth
      const bodyRequireScroll = document.body.scrollHeight > document.body.clientHeight
      document.body.style.overflowY = value ? 'hidden' : null
      document.body.style.paddingRight = value && bodyRequireScroll ? `${scrollWidth}px` : null
    })

    // lifecycle hooks
    onBeforeMount(() => {
      document.addEventListener('keyup', e => {
        if (e.key === 'Escape' && anyModalOpened.value) {
          const opened = data.modals.filter(({ opened }) => opened)
          const { id, blockCloseOnBackdrop } = opened[opened.length - 1]
          if (!blockCloseOnBackdrop) {
            modal.hide(id)
          }
        }
      })
    })

    return {
      // data
      ...toRefs(data),
      // methods
      add,
      remove,
      open,
      close,
      afterModalTransitionLeave,
      getAnyModalOpened,
      getModals
    }
  },

  created() {
    this.$modal._setGlobalModalContainer(this)
  }
})
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
