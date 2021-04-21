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
      @input="onSearchInput($event.target.value)"
      @keydown.enter.self="searchNow()"
    />

    <BaseLink v-if="searchString" class="recipes-list-search__clear-button" color="text-secondary" @click="onSearchInput(null)">
      <BaseIcon icon="close" weight="semi-bold" />
    </BaseLink>
    <BaseButton
      v-if="showFilterButton"
      class="recipes-list-search__filter-button"
      size="small"
      :subtle="true"
      :color="selectedFiltersCount > 0 ? 'primary' : 'contrast'"
      @click="openFilterModal()"
    >
      <BaseIcon class="recipes-list-search__filter-button__icon" icon="filter" weight="semi-bold" />
      <span>Filtry</span>
      <!-- <transition name="filters-button-count-fade"> -->
      <span v-if="selectedFiltersCount > 0" class="recipes-list-search__filter-button__count">
        {{ selectedFiltersCount }}
      </span>
      <!-- </transition> -->
    </BaseButton>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import FilterModal from './modals/FilterModal'

export default {
  emits: ['search'],
  props: {
    placeholder: {
      type: String,
      default: 'Szukaj'
    },
    search: String,
    sortings: Array,
    filters: Object,
    appliedSorting: String,
    appliedFilters: Object,
    defaultSorting: String,
    showFilterButton: Boolean
  },
  data: component => ({
    searchString: component.search,
    searchTimeoutCallback: null
  }),
  methods: {
    openFilterModal() {
      this.$modal.show(
        markRaw(FilterModal),
        {
          options: this.filters,
          defaultSelected: this.appliedFilters,
          orderOptions: this.sortings,
          defaultOrderSelected: this.appliedSorting || this.defaultSorting
        },
        {
          close: result => {
            if (result?.selected || result?.orderSelected) {
              this.$emit('search', { orderMethod: result.orderSelected, filters: result.selected, search: this.searchString })
            }
          }
        }
      )
    },
    onSearchInput(newValue) {
      this.searchString = newValue
      if (this.searchTimeoutCallback) {
        clearTimeout(this.searchTimeoutCallback)
      }
      this.searchTimeoutCallback = setTimeout(() => {
        this.emitSearch()
      }, 750)
    },
    searchNow() {
      if (this.searchTimeoutCallback) {
        clearTimeout(this.searchTimeoutCallback)
        this.searchTimeoutCallback = null
      }
      this.emitSearch()
    },
    emitSearch() {
      this.$emit('search', { orderMethod: this.appliedSorting, filters: this.appliedFilters, search: this.searchString })
    }
  },
  computed: {
    selectedFiltersCount() {
      // TODO add +1 if sorting
      if (typeof this.appliedFilters === 'object' && this.appliedFilters !== null) {
        return Object.entries(this.appliedFilters)
          .map(f => f[1].length)
          .reduce((a, b) => a + b, 0)
      }
      return 0
    }
  }
}
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
    height: 100%;
    padding: 8px;
    padding-left: 2px;
    flex: 1;
    border: none;
    background: transparent;
    font-weight: inherit;
    font-family: inherit;
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

    &__icon {
      // font-size: 1.5rem;
      transform: rotate(90deg);
    }

    &__count {
      opacity: 0.75;
    }

    span {
      padding: 0 4px;
      font-size: 10px;
      font-weight: bold;
    }
  }
}
</style>
