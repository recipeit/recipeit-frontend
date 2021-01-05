<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>{{ title }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody v-if="content">{{ content }}</BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked color="white" @click="secondaryClick">
        {{ secondaryText }}
      </BaseButton>
      <BaseButton class="submit-button" raised color="black" @click="primaryClick">
        {{ primaryText }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
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
.submit-button {
  width: 100%;

  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}
</style>
