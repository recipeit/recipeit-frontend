<template>
  <div class="recipe-directions-section">
    <SectionTitle
      size="large"
      title="Przygotowanie"
      :show-action="finishedDirections?.length > 0"
      action-text="usuń znaczniki"
      @action-click="resetFinishedDirections()"
    />
    <div v-if="directions?.length > 1" class="recipe-directions-list">
      <BaseCheckbox
        v-for="(paragraph, index) in directions"
        :key="index"
        v-model="finishedDirections"
        :class="{
          'recipe-directions-list-item': true,
          'recipe-directions-list-item--selected': index === selectedDirection,
          'recipe-directions-list-item--finished': finishedDirections.includes(index)
        }"
        :value="index"
      >
        <template #label>
          <div>{{ paragraph }}</div>
        </template>
      </BaseCheckbox>
    </div>
    <p v-else-if="directions?.length === 1" class="recipe-single-direction">
      {{ directions[0] }}
    </p>
  </div>
</template>

<script lang="ts">
import difference from 'lodash.difference'
import min from 'lodash.min'
import { computed, defineComponent, PropType, ref, watch } from 'vue'

import { useToast } from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import { useRecipesStore } from '@/stores/recipes'

import { RecipeEntity } from '@/typings/entities'

import SectionTitle from '@/components/SectionTitle.vue'

export default defineComponent({
  components: { SectionTitle },

  props: {
    recipeId: {
      type: String as PropType<RecipeEntity['id']>,
      required: true
    },
    directions: {
      type: Array as PropType<Array<string>>,
      required: true
    }
  },

  setup(props) {
    // usings
    const recipesStore = useRecipesStore()
    const toast = useToast()

    // data
    const finishedDirections = ref<Array<number>>(recipesStore.getFinishedDirectionsForRecipe(props.recipeId) || [])

    // computed
    const allIndexes = computed(() => {
      return props.directions.map((_, index) => index)
    })

    const selectedDirection = computed(() => {
      return min(difference(allIndexes.value, finishedDirections.value))
    })

    // methods
    const resetFinishedDirections = () => {
      finishedDirections.value = []
    }

    // watch
    watch(finishedDirections, newValue => {
      recipesStore.setFinishedDirectionsForRecipe({ recipeId: props.recipeId, finishedDirections: newValue })
      const remaining = difference(allIndexes.value, newValue)
      if (!remaining || remaining.length === 0) {
        finishedDirections.value = []
        toast.show('Super! Udało Ci się ukończyć przepis', ToastType.SUCCESS)
      }
    })

    return {
      // data
      finishedDirections,
      // computed
      selectedDirection,
      // methods
      resetFinishedDirections
    }
  }
})
</script>

<style lang="scss" scoped>
// default 0px offset == 5px margin
$border-offset: 3px;

.recipe-directions-section {
  .recipe-directions-list {
    label {
      display: flex;
      align-items: flex-start;

      input {
        margin-right: 16px;
      }
    }
  }

  .recipe-directions-list-item {
    position: relative;
    @include transition((color, text-decoration));

    &:not(:first-child) {
      margin-top: 16px;
    }

    &::before {
      content: '';
      width: 2px;
      background-color: var(--color-border);
      position: absolute;
      left: 9px;
      border-radius: 2px;
      top: 26px + $border-offset;
      bottom: -16px + $border-offset;
      @include transition((background-color));
    }

    &:last-of-type {
      &::before {
        content: none;
      }
    }

    &--finished {
      color: var(--color-text-secondary);
      text-decoration: line-through;

      &::before {
        background-color: var(--color-primary);
      }
    }

    &:not(&--finished) ~ &--finished {
      &::before {
        background-color: var(--color-border);
      }
    }

    &--selected {
      font-weight: bold;
    }

    :deep(.checkbox__input) {
      margin-top: 3px;
      margin-bottom: 3px;
      width: 20px;
      min-width: 20px;
      height: 20px;
      border-radius: 20px;
      margin-right: 12px;
    }

    :deep(.checkbox__label) {
      line-height: 26px;
    }
  }

  .recipe-single-direction {
    line-height: 26px;
  }
}
</style>
