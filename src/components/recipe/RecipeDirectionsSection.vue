<template>
  <div class="recipe-directions-section">
    <SectionTitle
      size="large"
      title="Przygotowanie"
      :showAction="finishedDirections && finishedDirections.length > 0"
      actionText="usuń znaczniki"
      @action-click="resetFinishedDirections()"
    />
    <div class="recipe-directions-list">
      <div
        v-for="(paragraph, index) in directions"
        :key="index"
        :class="{
          'recipe-directions-list-item': true,
          'recipe-directions-list-item--selected': index === selectedDirection,
          'recipe-directions-list-item--finished': finishedDirections.includes(index)
        }"
      >
        <BaseCheckbox v-model="finishedDirections" :value="index">
          <template #label>
            <div>{{ paragraph }}</div>
          </template>
        </BaseCheckbox>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { computed, markRaw, ref, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useModal } from '@/plugins/global-sheet-modal'
import SectionTitle from '@/components/SectionTitle'
import Dialog from '@/components/modals/Dialog'

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
    const modal = useModal()

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
        modal.show(
          markRaw(Dialog),
          {
            title: 'Zrobione',
            content: 'Udało Ci się ukończyć cały przepis',
            secondaryText: 'OK!'
          },
          {
            close: () => {
              finishedDirections.value = []
            }
          }
        )
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
  @include transition((color, text-decoration));

  &--finished {
    color: var(--color-text-secondary);
    text-decoration: line-through;
  }

  &--selected {
    font-weight: bold;
  }

  & + & {
    margin-top: 16px;
  }
}
</style>
