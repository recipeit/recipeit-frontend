<template>
  <SheetModalContent class="sort-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>{{ $t('sortModal.title') }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div class="sort-modal-body">
        <template v-for="sortingMethod in options" :key="sortingMethod">
          <BaseButton
            v-if="sortingMethod === defaultSelected"
            class="choice-button"
            raised
            color="primary"
            @click="$emit('close', sortingMethod)"
          >
            {{ $t(`recipesSortingMethods.${sortingMethod}`) }}
          </BaseButton>
          <BaseButton v-else class="choice-button" stroked color="white" @click="$emit('close', sortingMethod)">
            {{ $t(`recipesSortingMethods.${sortingMethod}`) }}
          </BaseButton>
        </template>
      </div>
    </BaseModalBody>
  </SheetModalContent>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    defaultSelected: {
      type: String
    }
  },
  emits: ['close']
}
</script>

<style lang="scss" scoped>
.sort-modal {
  .choice-button {
    width: 100%;
    justify-content: flex-start;
  }

  .choice-button + .choice-button {
    margin-top: 16px;
  }
}
</style>
