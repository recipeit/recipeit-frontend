<template>
  <div ref="grid" class="recipes-list-grid">
    <template v-for="({ item, page }, index) in itemsList">
      <RecipeBox v-if="item" :key="item.id" :recipe-id="item.id" :recipe-slug="item.slug || item.id" :recipe-name="item.name" />
      <SkeletonRecipeBox v-else :key="`${page}_${index}`" :ref="skeletonBoxMountedHandler" :page="page" :animate="false" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount, onBeforeUnmount, onMounted, PropType, ref } from 'vue'

import { RecipesPageState } from '@/models/RecipesPageState'

import RecipeBox from '@/components/RecipeBox.vue'
import SkeletonRecipeBox from '@/components/skeletons/SkeletonRecipeBox.vue'

const PAGE_SIZE = 12

export default defineComponent({
  components: {
    RecipeBox,
    SkeletonRecipeBox
  },

  props: {
    recipes: {
      // TODO trzeba rozdzielić że albo to albo tamto
      type: Object as PropType<RecipesPageState>,
      required: true
    },
    loadHandler: {
      type: Function as PropType<(pageNumber: number) => Promise<true | Error>>,
      required: true
    }
  },

  emits: ['initial-height'],

  setup(props, { emit }) {
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
        emit('initial-height', initialHeight.value)
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
          emit('initial-height', initialHeight.value)
        })
      }
    })

    onBeforeUnmount(() => {
      disconnectObservers()
    })

    return {
      grid,
      initialHeight,
      requiredItems,
      itemsList,
      skeletonBoxMountedHandler,

      intersectionObservers,
      fetchingPages,
      disconnectObservers
    }
  }
})
</script>

<style lang="scss">
.recipes-list-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  @media (min-width: 721px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
