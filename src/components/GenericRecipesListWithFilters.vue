<template>
  <div class="recipes-list" :style="initialStyle">
    <SearchWithFilter
      v-if="showFilterButtons"
      class="recipes-list-filter"
      placeholder="Szukaj przepisu"
      :show-filter-button="true"
      :search="recipes.search"
      :fetching="recipes.fetching"
      :fetching-pages="recipes.fetchingPages"
      :filters="recipes.filterOptions"
      :sortings="recipes.orderMethodOptions"
      :applied-filters="recipes.filters"
      :applied-sorting="recipes.orderMethod"
      :default-sorting="recipes.defaultOrderMethod"
      :filters-count="filtersCount"
      :error="!!errors"
      @search="onSearch($event)"
    />

    <slot name="above-list" />

    <template v-if="recipes.totalCount === 0 && !recipes.fetching">
      <slot v-if="filtersCount > 0 || recipes.search" name="empty-with-filters">
        <EmptyListMessage :button-text="'Wyczyść filtry'" @button-click="clearFilters()">
          <template #title>Nie znaleźliśmy przepisów dla użytych filtrów</template>
        </EmptyListMessage>
      </slot>

      <slot v-else name="empty-without-filters">
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
import { computed, defineComponent, PropType, ref, watch } from 'vue'

import { RecipesFilteredPageState } from '@/models/RecipesFilteredPageState'

import EmptyListMessage from '@/components/EmptyListMessage.vue'
import GenericRecipesListError from '@/components/GenericRecipesListError.vue'
import GenericRecipesListGrid from '@/components/GenericRecipesListGrid.vue'
import GenericRecipesListHeader from '@/components/GenericRecipesListHeader.vue'
import SearchWithFilter from '@/components/SearchWithFilter.vue'

export default defineComponent({
  components: {
    SearchWithFilter,
    // Observer
    EmptyListMessage,
    GenericRecipesListHeader,
    GenericRecipesListGrid,
    GenericRecipesListError
  },

  props: {
    recipes: {
      type: Object as PropType<RecipesFilteredPageState>
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
    const searchString = ref(props.recipes.search)
    const searchTimeoutCallback = ref(null)
    const gridComponent = ref<typeof GenericRecipesListGrid>(null)
    const initialHeight = ref(0)

    const onSearch = ({ orderMethod, filters, search }) => {
      gridComponent.value?.disconnectObservers()
      emit('reload', { orderMethod, filters, search })
    }

    const clearFilters = () => {
      gridComponent.value?.disconnectObservers()
      emit('reload', {})
    }

    const countFilters = () => {
      let count = 0

      const { filters: appliedFilters, orderMethod: appliedSorting, defaultOrderMethod: defaultSorting } = props.recipes

      if (typeof appliedFilters === 'object' && appliedFilters !== null) {
        count += Object.entries(appliedFilters)
          .map(f => f[1].length)
          .reduce((a, b) => a + b, 0)
      }

      if (appliedSorting && appliedSorting !== defaultSorting) {
        count++
      }

      return count
    }

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

    const filtersCount = ref(countFilters())

    watch(
      () => [props.recipes.filters, props.recipes.orderMethod],
      () => {
        if (!props.recipes.fetching) {
          filtersCount.value = countFilters()
        }
      }
    )

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
      searchString,
      searchTimeoutCallback,
      tryFetchOnError,
      onSearch,
      clearFilters,
      filtersCount,

      // NEW BELOW
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

  .recipes-list-filter {
    margin-bottom: 1rem;
  }
}
</style>
