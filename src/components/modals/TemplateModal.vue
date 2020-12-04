<template>
  <global-sheet-modal-content>
    AYEEEEEE {{ time }}
    <button @click="more">Daj następny</button>
  </global-sheet-modal-content>
</template>

<script>
import { markRaw } from 'vue'
import TemplateModal from '@/components/modals/TemplateModal'

export default {
  data() {
    return {
      time: null
    }
  },
  created() {
    this.time = Date.now()
  },
  methods: {
    more() {
      this.$modal.show(markRaw(TemplateModal), {}, {})
    }
  }
}
</script>
