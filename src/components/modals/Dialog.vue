<template>
  <SheetModalContent class="dialog">
    <BaseModalHeader @close="$emit('close', false)">
      <BaseModalTitle>{{ title }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody v-if="content" class="content">{{ content }}</BaseModalBody>
    <BaseModalFooter>
      <BaseButton v-if="secondaryText" class="submit-button" stroked color="white" @click="secondaryClick">
        {{ secondaryText }}
      </BaseButton>
      <BaseButton v-if="primaryText" class="submit-button" raised color="primary" @click="primaryClick">
        {{ primaryText }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    },
    secondaryText: {
      type: String
    },
    primaryText: {
      type: String
    }
  },
  emits: ['close'],
  methods: {
    primaryClick() {
      this.$emit('close', true)
    },
    secondaryClick() {
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  .submit-button {
    width: 100%;
  }

  .content {
    font-size: 0.875rem;
  }
}
</style>
