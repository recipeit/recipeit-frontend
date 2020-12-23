<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>{{ $t('sortModal.title') }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div class="sort-modal-body">
        <template v-for="sortingMethod in sortingMethods" :key="sortingMethod">
          <BaseButton
            v-if="sortingMethod === selected"
            class="choice-button"
            raised
            color="black"
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
import { recipesSortingMethods, defaultRecipesSortingMethod } from '@/constants'

export default {
  props: {
    defaultSelected: {
      type: String
    }
  },
  data() {
    return {
      selected: this.defaultSelected || defaultRecipesSortingMethod,
      sortingMethods: recipesSortingMethods
    }
  },
  computed: {},
  methods: {}
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
