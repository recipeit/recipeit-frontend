<template>
  <div class="recipes-list-search">
    <BaseLink class="recipes-list-search__search-button" color="text-secondary" @click="searchNow()">
      <BaseIcon icon="search" weight="semi-bold" />
    </BaseLink>
    <input
      type="text"
      class="recipes-list-search__input"
      :value="searchString"
      :placeholder="placeholder"
      @input="onSearchInput(($event.target as HTMLInputElement).value)"
      @keydown.enter.self="searchNow()"
    />

    <BaseLink v-if="searchString" class="recipes-list-search__clear-button" color="text-secondary" @click="onSearchInput(null)">
      <BaseIcon icon="close" weight="semi-bold" />
    </BaseLink>
    <BaseButton
      v-if="showFilterButton"
      class="recipes-list-search__filter-button"
      :subtle="true"
      :color="filtersCount > 0 ? 'primary' : 'contrast'"
      :disabled="error"
      @click="openFilterModal()"
    >
      <BaseIcon class="recipes-list-search__filter-button__icon" icon="filter" weight="semi-bold" />
      <span>Filtry</span>
      <!-- <transition name="filters-button-count-fade"> -->
      <span v-if="filtersCount > 0" class="recipes-list-search__filter-button__count">
        {{ filtersCount }}
      </span>
      <!-- </transition> -->
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { markRaw, watch, defineComponent, PropType, reactive, toRefs } from 'vue'

import { useModal } from '@/plugins/global-sheet-modal'
import { useToast } from '@/plugins/toast'

import FilterModal from '@/components/modals/FilterModal.vue'

export default defineComponent({
  props: {
    placeholder: {
      type: String,
      default: 'Szukaj'
    },
    search: String,
    sortings: {
      type: Array as PropType<Array<string>>
    },
    filters: Object,
    appliedSorting: String,
    appliedFilters: Object,
    defaultSorting: String,
    showFilterButton: Boolean,
    fetching: Boolean,
    fetchingPages: Object,
    filtersCount: Number,
    error: Boolean
  },

  emits: ['search'],

  setup(props, { emit }) {
    // usings
    const modal = useModal()
    const toast = useToast()

    // data
    const data = reactive({
      searchString: props.search,
      searchTimeoutCallback: null
    })

    // internal methods
    const anyPageFetching = () => {
      return Object.values(props.fetchingPages).some(v => v)
    }

    // methods
    const openFilterModal = () => {
      if (anyPageFetching()) {
        return
      }

      if (!props.filters || !props.sortings) {
        toast.show('Nie udało się wyświetlić filtrów', 'error')
        return
      }

      modal.show(
        markRaw(FilterModal),
        {
          options: props.filters,
          defaultSelected: props.appliedFilters,
          orderOptions: props.sortings,
          defaultOrderSelected: props.appliedSorting || props.defaultSorting
        },
        {
          close: result => {
            const defaultOrderMethodSelected = !result || !result.orderSelected || result.orderSelected === props.defaultSorting
            if (result?.selected || result?.orderSelected) {
              emit('search', {
                orderMethod: defaultOrderMethodSelected ? null : result.orderSelected,
                filters: result.selected,
                search: data.searchString
              })
            }
          }
        }
      )
    }

    const onSearchInput = (newValue: string) => {
      data.searchString = newValue
      if (data.searchTimeoutCallback) {
        clearTimeout(data.searchTimeoutCallback)
      }
      data.searchTimeoutCallback = setTimeout(() => {
        emitSearch()
      }, 750)
    }

    const searchNow = () => {
      if (data.searchTimeoutCallback) {
        clearTimeout(data.searchTimeoutCallback)
        data.searchTimeoutCallback = null
      }
      emitSearch()
    }

    const emitSearch = () => {
      if ((!data.searchString && !props.search === true) || data.searchString === props.search || anyPageFetching()) {
        return
      }

      emit('search', { orderMethod: props.appliedSorting, filters: props.appliedFilters, search: data.searchString })
    }

    // watchers
    watch(
      () => [props.search, props.fetchingPages],
      () => {
        if (data.searchString !== props.search && !Object.values(props.fetchingPages).some(v => v)) {
          data.searchString = props.search
        }
      }
    )

    return {
      // data
      ...toRefs(data),
      // methods
      openFilterModal,
      onSearchInput,
      searchNow,
      emitSearch
    }
  }
})
</script>

<style lang="scss" scoped>
.recipes-list-search {
  $root: &;

  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 7px;
  border-radius: 48px;
  border: 1px solid var(--color-border);
  @include transition((border-color));

  &:hover {
    border-color: var(--color-border-hover);
  }

  #{ $root }--focus & {
    border-color: var(--color-primary);
  }

  &__input {
    min-width: 0;
    height: 100%;
    padding: 8px;
    padding-left: 2px;
    flex: 1;
    border: none;
    background: transparent;
    font-weight: inherit;
    font-family: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    color: var(--color-text-primary);

    &::placeholder {
      opacity: 1;
      color: var(--color-text-secondary);
    }
  }

  &__search-button,
  &__clear-button {
    padding: 0.5rem;
    font-size: 1rem;
    height: 2rem;
    line-height: 1;
  }

  &__filter-button {
    font-size: 1rem;
    padding: 0 12px;
    height: 32px;
    min-width: 32px;
    flex-shrink: 0;

    &__icon {
      // font-size: 1.5rem;
      transform: rotate(90deg);
    }

    &__count {
      min-width: 1rem;
      height: 1rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-button-raised-primary-background);
      color: var(--color-button-raised-primary-color);
    }

    span {
      padding: 0 4px;
      font-size: 10px;
      font-weight: bold;
    }
  }
}
</style>
