<template>
  <SheetModalContent class="dialog">
    <BaseModalHeader @close="$emit('close', false)">
      <BaseModalTitle>{{ title }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody v-if="content" class="content">{{ content }}</BaseModalBody>
    <BaseModalFooter>
      <BaseButton v-if="secondaryText" class="submit-button" stroked color="white" @click="secondaryClick()">
        {{ secondaryText }}
      </BaseButton>
      <BaseButton v-if="primaryText" class="submit-button" raised color="primary" @click="primaryClick()">
        {{ primaryText }}
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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

  setup(_, { emit }) {
    const primaryClick = () => {
      emit('close', true)
    }

    const secondaryClick = () => {
      emit('close', false)
    }

    return {
      primaryClick,
      secondaryClick
    }
  }
})
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
