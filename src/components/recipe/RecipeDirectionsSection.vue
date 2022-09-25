<template>
  <div class="recipe-directions-section">
    <SectionTitle
      size="large"
      title="Przygotowanie"
      :show-action="finishedDirections?.length > 0"
      action-text="usuń znaczniki"
      @action-click="resetFinishedDirections()"
    />

    <div v-if="preparedDirections[0] === 'grouped'">
      <div v-for="{ groupName, subDirections } in preparedDirections[1]" :key="groupName" class="recipe-directions-list">
        <div v-if="groupName" class="recipe-directions-group-name">{{ groupName }}</div>
        <BaseCheckbox
          v-for="{ value, index } in subDirections"
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
            <div>{{ value }}</div>
          </template>
        </BaseCheckbox>
      </div>
    </div>

    <p v-else class="recipe-single-direction">
      {{ preparedDirections[1] }}
    </p>
  </div>
</template>

<script lang="ts">
import difference from 'lodash.difference'
import min from 'lodash.min'
import { computed, defineComponent, PropType, ref, watch } from 'vue'

import { useToast } from '@/plugins/toast'

import { useRecipesStore } from '@/stores/recipes'

import { RecipeEntity } from '@/typings/entities'

import SectionTitle from '@/components/SectionTitle.vue'
import groupBy from 'lodash.groupby'

type GroupedDirectionsItem = {
  groupName?: string
  subDirections: Array<{ index: number; value: string }>
}

const groupRegex = /\[RCPT_GROUP=(\d+)\](.+)/
const groupItemRegex = /\[RCPT_GROUP_ITEM=(\d+)\](.+)/

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
    const preparedDirections = computed<[type: 'single', value: string] | [type: 'grouped', value: Array<GroupedDirectionsItem>]>(() => {
      if (props.directions?.length <= 1) {
        return ['single', props.directions[0]]
      }

      if (props.directions.some(direction => direction.startsWith('[RCPT_GROUP'))) {
        const groups = Object.fromEntries(
          props.directions
            .filter(direction => direction.startsWith('[RCPT_GROUP='))
            .map(direction => {
              const [, groupKey, groupName] = direction.match(groupRegex)

              return [groupKey, groupName]
            })
        )

        const realDirections = props.directions
          .filter(direction => !direction.startsWith('[RCPT_GROUP='))
          .map((direction, index) => {
            const [, groupKey, value] = direction.match(groupItemRegex)

            return {
              groupKey,
              index,
              value
            }
          })

        const groupedRealDirection = groupBy(realDirections, ({ groupKey }) => groupKey)

        const lol = Object.entries(groupedRealDirection).map(([groupKey, list]) => ({
          groupName: groups[groupKey],
          subDirections: list.map(({ value, index }) => ({ value, index }))
        }))

        return ['grouped', lol]
      }

      return ['grouped', [{ subDirections: props.directions.map((value, index) => ({ value, index })) }]]
    })

    const allIndexes = computed(() => {
      if (preparedDirections.value[0] == 'single') return [0]

      return preparedDirections.value[1].flatMap(({ subDirections }) => subDirections).map(({ index }) => index)
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
        toast.show('Super! Udało Ci się ukończyć przepis', 'success')
      }
    })

    return {
      // data
      finishedDirections,
      // computed
      selectedDirection,
      preparedDirections,
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

  .recipe-directions-list + .recipe-directions-list {
    margin-top: 32px;
  }

  .recipe-directions-group-name {
    // margin-left: 32px;
    // text-transform: uppercase;
    font-weight: 700;
    color: var(--color-text-primary);
    // font-size: 0.875rem;
    text-align: center;
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
