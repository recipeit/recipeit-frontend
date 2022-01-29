<template>
  <SheetModalContent>
    <BaseModalBody>
      <Authorization />
    </BaseModalBody>
  </SheetModalContent>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Authorization from '@/components/Authorization.vue'

export default defineComponent({
  components: { Authorization }
})
</script>
