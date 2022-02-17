<template>
  <div class="recipes-list" :style="initialStyle">
    <slot name="above-list" />

    <template v-if="recipes.totalCount === 0 && !recipes.fetching">
      <slot name="empty-without-filters">
        <EmptyListMessage>
          <template #title>Nie znaleźliśmy przepisów pasujących do Twoich produktów</template>
        </EmptyListMessage>
      </slot>
    </template>

    <template v-else>
      <GenericRecipesListHeader :count="recipes.totalCount" :show-all-link="showAllLink" :fetching="showFetchingInfo">
        <template #count="{ count, fetching }">
          <slot name="count" :count="count" :fetching="fetching" />
        </template>
      </GenericRecipesListHeader>

      <GenericRecipesListGrid ref="gridComponent" :recipes="recipes" :load-handler="loadHandler" @initial-height="initialHeight = $event" />

      <GenericRecipesListError v-if="errors" @click="tryFetchOnError()" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'

import { RecipesPageState } from '@/models/RecipesPageState'

import EmptyListMessage from '@/components/EmptyListMessage.vue'
import GenericRecipesListError from '@/components/GenericRecipesListError.vue'
import GenericRecipesListGrid from '@/components/GenericRecipesListGrid.vue'
import GenericRecipesListHeader from '@/components/GenericRecipesListHeader.vue'

export default defineComponent({
  components: {
    EmptyListMessage,
    GenericRecipesListHeader,
    GenericRecipesListGrid,
    GenericRecipesListError
  },

  props: {
    recipes: {
      // TODO trzeba rozdzielić że albo to albo tamto
      type: Object as PropType<RecipesPageState>
    },
    errors: {
      type: Object,
      default: null
    },
    showAllLink: {
      type: [String, Object]
    },
    limitedItems: {
      type: Number,
      default: null
    },
    showFilterButtons: {
      type: Boolean,
      default: true
    },
    loadHandler: {
      type: Function as PropType<(pageNumber: number) => Promise<true | Error>>,
      required: true
    }
  },

  emits: ['reload', 'load', 'reload-with-query', 'load-next'],

  setup(props, { emit }) {
    const gridComponent = ref<typeof GenericRecipesListGrid>(null)
    const initialHeight = ref(0)

    const tryFetchOnError = () => {
      if (props.errors === null) return
      const { from, query } = props.errors

      if (from === 'RELOAD') {
        gridComponent.value?.disconnectObservers()
        emit('reload-with-query', query)
      } else if (from === 'LOAD-NEXT') {
        emit('load-next')
      }
    }

    // NEW

    const showFetchingInfo = computed(() => {
      return Object.values(props.recipes.fetchingPages).some(v => v) && Object.keys(props.recipes.pagedItems || {}).length === 0
    })

    const initialStyle = computed(() => {
      if (initialHeight.value) {
        return `min-height: ${initialHeight.value}px`
      }
      return null
    })

    // END NEW

    return {
      tryFetchOnError,
      initialStyle,
      showFetchingInfo,
      gridComponent,
      initialHeight
    }
  }
})
</script>

<style lang="scss" scoped>
.recipes-list {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
