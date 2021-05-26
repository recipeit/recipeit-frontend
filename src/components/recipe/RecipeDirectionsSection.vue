<template>
  <div class="recipe-directions-section">
    <SectionTitle
      size="large"
      title="Przygotowanie"
      :showAction="finishedDirections && finishedDirections.length > 0"
      actionText="usuń znaczniki"
      @action-click="resetFinishedDirections()"
    />
    <div v-if="directions?.length > 1" class="recipe-directions-list">
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
    // const modal = useModal()

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
        // modal.show(
        //   markRaw(Dialog),
        //   {
        //     title: 'Zrobione',
        //     content: 'Udało Ci się ukończyć cały przepis',
        //     secondaryText: 'OK!'
        //   },
        //   {
        //     close: () => {
        //       finishedDirections.value = []
        //     }
        //   }
        // )
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
