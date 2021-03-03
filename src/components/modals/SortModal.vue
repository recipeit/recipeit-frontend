<template>
  <sheet-modal-content>
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
            color="contrast"
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
  </sheet-modal-content>
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
  }
}
</script>

<style lang="scss" scoped>
.choice-button {
  width: 100%;
  justify-content: flex-start;

  & + & {
    margin-top: 16px;
  }
}
</style>
