<template>
  <div class="recipe-directions-section">
    <SectionTitle
      size="large"
      title="Przygotowanie"
      :showAction="finishedDirections?.length > 0"
      actionText="usuń znaczniki"
      @action-click="resetFinishedDirections()"
    />
    <div v-if="directions?.length > 1" class="recipe-directions-list">
      <BaseCheckbox
        v-for="(paragraph, index) in directions"
        :key="index"
        :class="{
          'recipe-directions-list-item': true,
          'recipe-directions-list-item--selected': index === selectedDirection,
          'recipe-directions-list-item--finished': finishedDirections.includes(index)
        }"
        :value="index"
        v-model="finishedDirections"
      >
        <template #label>
          <div>{{ paragraph }}</div>
        </template>
      </BaseCheckbox>
    </div>
    <p class="recipe-single-direction" v-else-if="directions?.length === 1">
      {{ directions[0] }}
    </p>
  </div>
</template>

<script>
import _ from 'lodash'
import { computed, ref, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import SectionTitle from '@/components/SectionTitle'
import { useToast } from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

export default {
  components: { SectionTitle },
  props: {
    recipeId: {
      type: String,
      required: true
    },
    directions: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const toast = useToast()

    const finishedDirections = ref(store.getters['recipes/getFinishedDirectionsForRecipe'](props.recipeId) || [])

    const allIndexes = computed(() => {
      return props.directions.map((_, index) => index)
    })

    const selectedDirection = computed(() => {
      return _.min(_.difference(allIndexes.value, finishedDirections.value))
    })

    const resetFinishedDirections = () => {
      finishedDirections.value = []
    }

    watch(finishedDirections, newValue => {
      store.dispatch('recipes/setFinishedDirectionsForRecipe', { recipeId: props.recipeId, finishedDirections: newValue })
      const remaining = _.difference(allIndexes.value, newValue)
      if (!remaining || remaining.length === 0) {
        finishedDirections.value = []
        toast.show('Super! Udało Ci się ukończyć przepis', ToastType.SUCCESS)
      }
    })

    return {
      finishedDirections,
      selectedDirection,
      resetFinishedDirections
    }
  }
}
</script>

<style lang="scss" scoped>
// default 0px offset == 5px margin
$border-offset: 3px;

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

  & + & {
    margin-top: 16px;
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
</style>
