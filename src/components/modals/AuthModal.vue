<template>
  <SheetModalContent>
    <BaseModalBody>
      <Authorization />
    </BaseModalBody>
  </SheetModalContent>
</template>

<script>
import Authorization from '@/components/Authorization.vue'

export default {
  components: { Authorization }
}
</script>
