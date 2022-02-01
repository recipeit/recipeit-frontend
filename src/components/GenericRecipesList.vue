<template>
  <div class="recipes-list" :style="initialStyle">
    <SearchWithFilter
      v-if="showFilterButtons"
      class="recipes-list__filter"
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
        <div class="empty-list-message">
          <img class="empty-list-message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
          <p class="empty-list-message-title">Nie znaleźliśmy przepisów dla użytych filtrów</p>
          <BaseButton stroked @click="clearFilters()">Wyczyść filtry</BaseButton>
        </div>
      </slot>

      <slot v-else name="empty-without-filters">
        <div class="empty-list-message">
          <img class="empty-list-message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
          <p class="empty-list-message-title">Nie znaleźliśmy przepisów pasujących do Twoich produktów</p>
        </div>
      </slot>
    </template>

    <template v-else>
      <div class="recipes-list__header">
        <slot name="count" :count="recipes.totalCount" :fetching="showFetchingInfo">
          <div class="recipes-list__header__total-count">
            <!-- <template v-if="recipes.totalCount !== null && !recipes.fetching"> -->
            <template v-if="recipes.totalCount !== null">
              {{ $tc('shared.recipes', recipes.totalCount) }}
            </template>
            <template v-else-if="showFetchingInfo">
              <SkeletonBox class="total-count-skeleton" />
            </template>
          </div>
        </slot>
        <div v-if="showAllLink" class="recipes-list__header__show-all">
          <router-link v-slot="{ href, navigate }" :to="showAllLink" custom>
            <BaseLink :href="href" color="primary" class="recipes-list__header__show-all__button" @click="navigate($event)">
              {{ $t('shared.seeAll') }}
            </BaseLink>
          </router-link>
        </div>
      </div>

      <div ref="grid" class="recipes-list__list">
        <template v-for="({ item, page }, index) in itemsList">
          <RecipeBox v-if="item" :key="item.id" :recipe-id="item.id" :recipe-slug="item.slug || item.id" :recipe-name="item.name" />
          <SkeletonRecipeBox v-else :key="`${page}_${index}`" :ref="skeletonBoxMountedHandler" :page="page" :animate="false" />
        </template>
      </div>

      <div v-if="errors" class="recipes-errors">
        <div class="recipes-errors-message">Wystąpił błąd podczas wczytywania</div>
        <BaseButton stroked @click="tryFetchOnError()">Spróbuj ponownie</BaseButton>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'

import { RecipesFilteredPageState } from '@/models/RecipesFilteredPageState'
import { RecipesPageState } from '@/models/RecipesPageState'

import RecipeBox from '@/components/RecipeBox.vue'
import SearchWithFilter from '@/components/SearchWithFilter.vue'
import SkeletonBox from '@/components/skeletons/SkeletonBox.vue'
import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox.vue'

const PAGE_SIZE = 12

export default defineComponent({
  components: {
    SearchWithFilter,
    SkeletonRecipeBox,
    RecipeBox,
    // Observer

    SkeletonBox
  },

  props: {
    recipes: {
      type: Object as PropType<RecipesPageState & RecipesFilteredPageState> // TODO trzeba rozdzielić że albo to albo tamto
    },
    errors: {
      type: Object,
      default: null
    },
    apiEndpoint: {
      type: Function
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
      type: Function,
      required: true
    }
  },

  emits: ['reload', 'load', 'reload-with-query', 'load-next'],

  setup(props, { emit }) {
    const searchString = ref(props.recipes.search)
    const searchTimeoutCallback = ref(null)

    const onSearch = ({ orderMethod, filters, search }) => {
      disconnectObservers()
      emit('reload', { orderMethod, filters, search })
    }

    const clearFilters = () => {
      disconnectObservers()
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
        disconnectObservers()
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

    const grid = ref()
    const initialHeight = ref()
    const requiredItems = ref()

    const itemsList = computed(() => {
      const loadedPageNumbers = Object.keys(props.recipes.pagedItems).map(e => parseInt(e))
      const lastLoadedPage = loadedPageNumbers?.length > 0 ? Math.max(...loadedPageNumbers) : 0

      let result = []
      for (let i = 1; i <= lastLoadedPage + 1; i++) {
        const loadedPage = props.recipes.pagedItems[i]
        if (loadedPage?.length > 0) {
          result.push(...loadedPage.map(item => ({ page: i, item })))
        } else {
          result.push(...Array(PAGE_SIZE).fill({ page: i, item: null }))
        }
      }

      // TODO trzeba optymalniej, gdzieś na górze nie dodawać niepotrzebnych elementów
      if (props.recipes.totalCount && result.length > props.recipes.totalCount) {
        result = result.slice(0, props.recipes.totalCount)
      }

      let additionalItems = 0
      if (requiredItems.value > result.length) {
        // czyli chcemy żeby było więcej dorzucone
        if (props.recipes.totalCount) {
          // czyli już zaczytaliśmy jakąś stronkę
          if (props.recipes.totalCount > result.length) {
            // weryfikujemy czy jeszcze jest co wczytywać
            additionalItems = Math.min(props.recipes.totalCount, requiredItems.value) - result.length
            // blokujemy opcję dorenderowania elementów które nie istnieją
          }
        } else {
          // czyli jest to inital state, nie wiemy ile elementów ma lista
          additionalItems = requiredItems.value - result.length
        }
      }

      const additionalPages = Math.ceil(additionalItems / PAGE_SIZE)

      for (let j = 1; j <= additionalPages; j++) {
        const itemsCountToAdd = j === additionalPages ? additionalItems % PAGE_SIZE || PAGE_SIZE : PAGE_SIZE
        result.push(...Array(itemsCountToAdd).fill({ page: lastLoadedPage + j, item: null }))
      }

      return result
    })

    const isInViewport = (element: Element) => {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }

    let intersectionObservers: { [k: number]: IntersectionObserver } = {}
    let fetchingPages = {}
    const skeletonBoxMountedHandler = el => {
      if (!el) {
        return
      }

      const { page: pageNumber, $el } = el
      let observer = intersectionObservers[pageNumber]

      const isIntersectingHandler = () => {
        // console.log('sproboje ładować')
        if (!fetchingPages[pageNumber]) {
          fetchingPages[pageNumber] = true
          props
            .loadHandler(pageNumber)
            .then(() => {
              observer.disconnect()
            })
            .catch(() => {
              delete fetchingPages[pageNumber]
            })
        }
      }

      if (!observer) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry && entry.isIntersecting) {
              isIntersectingHandler()
            }
          },
          { rootMargin: '256px' }
        )

        intersectionObservers[pageNumber] = observer
      }

      if ($el) {
        if (isInViewport($el)) {
          isIntersectingHandler()
        } else {
          observer.observe($el)
        }
      }
    }

    const disconnectObservers = () => {
      Object.values(intersectionObservers).forEach(observer => {
        observer?.disconnect()
      })
      // intersectionObservers = {} // POLEMIZOWAŁBYm
      fetchingPages = {}
    }

    onBeforeMount(() => {
      const { top } = history.state?.scroll || {}
      if (top) {
        initialHeight.value = top + window.innerHeight
      }
    })

    onMounted(() => {
      if (initialHeight.value) {
        const { offsetWidth: gridWidth } = grid.value || {}
        const { offsetHeight, offsetWidth } = grid.value?.children[0] || {}

        const gridRowGap = parseFloat(getComputedStyle(grid.value).rowGap)
        const gridColumnGap = parseFloat(getComputedStyle(grid.value).columnGap)

        const rows = Math.ceil(initialHeight.value / (offsetHeight + gridRowGap))
        const columns = Math.floor((gridWidth + gridColumnGap) / (offsetWidth + gridColumnGap))

        requiredItems.value = rows * columns

        nextTick().then(() => {
          initialHeight.value = null
        })
      }
    })

    onBeforeUnmount(() => {
      disconnectObservers()
    })

    const initialStyle = computed(() => {
      if (initialHeight.value) {
        return `min-height: ${initialHeight.value}px`
      }
      return null
    })

    const showFetchingInfo = computed(() => {
      return Object.values(props.recipes.fetchingPages).some(v => v) && Object.keys(props.recipes.pagedItems || {}).length === 0
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
      grid,
      initialHeight,
      initialStyle,
      requiredItems,
      itemsList,
      skeletonBoxMountedHandler,

      intersectionObservers,
      fetchingPages,
      showFetchingInfo
    }
  }
})
</script>

<style lang="scss" scoped>
.recipes-list {
  display: flex;
  flex-direction: column;
  flex: 1;

  .total-count-skeleton {
    height: 12px;
    margin: 0.375em 0;
    border-radius: 8px;
    width: 88px;
  }

  &__filter {
    margin-bottom: 1rem;
  }

  &__header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: bold;

    &__total-count {
      color: var(--color-text-secondary);
    }

    &__show-all {
      cursor: pointer;

      &__button {
        display: flex;
        align-items: center;

        &__icon {
          font-size: 20px;
          margin-right: 4px;
        }
      }
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    // flex-wrap: wrap;
    // max-width: 416px;
    // margin: -8px;

    @media (min-width: 721px) {
      grid-template-columns: repeat(3, 1fr);
    }

    // &__item {
    // width: 50%;
    // padding: 0.5rem 0.5rem 1rem 0.5rem;
    // box-sizing: border-box;
    // cursor: pointer;

    // &--skeleton {
    //   cursor: initial;
    // }

    // &.full-width {
    //   width: 100%;
    // }
    // }
  }

  .empty-list-message {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    flex: 1;
    line-height: 2.25;

    .empty-list-message-image {
      width: 96px;
    }

    .empty-list-message-title {
      margin-bottom: 1rem;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  }

  .recipes-errors {
    text-align: center;
    margin: 48px 0;

    .recipes-errors-message {
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
  }
}
</style>
