import { RecipeEntity } from '@/typings/entities'
import { RecipeSortingMethod } from '@/typings/recipeFilters'
import { RecipeFilterOptions, RecipeFilters, RecipesFilteredPage } from '@/typings/recipesPage'

export class RecipesFilteredPageState {
  fetching = false
  fetchingPages: { [key: number]: boolean } = {}
  items: Array<RecipeEntity> = null
  pagedItems: { [key: number]: Array<RecipeEntity> } = {}
  pagesTo: number | null = null
  totalPages: number | null = null
  totalCount: number | null = null
  hasNext: boolean | null = null

  search: string
  filters: RecipeFilters
  orderMethod: RecipeSortingMethod
  filterOptions: RecipeFilterOptions = null
  orderMethodOptions: Array<RecipeSortingMethod> = null
  defaultOrderMethod: RecipeSortingMethod = null

  constructor(orderMethod?: RecipeSortingMethod, filters?: RecipeFilters, search?: string) {
    this.search = search || null
    this.filters = filters || {}
    this.orderMethod = orderMethod || null
  }

  setFromApi({
    fetching,
    items,
    currentPage,
    totalPages,
    totalCount,
    hasNext,
    search,
    orderMethod,
    filters,
    orderMethodOptions,
    filterOptions,
    defaultOrderMethod
  }: RecipesFilteredPage & { fetching: boolean }) {
    this.fetching = fetching
    this.items = [...items]
    this.pagedItems = {
      [currentPage]: items
    }
    this.pagesTo = currentPage
    this.totalPages = totalPages
    this.totalCount = totalCount
    this.hasNext = hasNext
    this.search = search
    this.orderMethod = orderMethod
    this.filters = filters
    this.orderMethodOptions = orderMethodOptions
    this.filterOptions = filterOptions
    this.defaultOrderMethod = defaultOrderMethod
  }

  addFromApi({
    items,
    currentPage,
    totalPages,
    totalCount,
    hasNext,
    search,
    orderMethod,
    filters,
    orderMethodOptions,
    filterOptions,
    defaultOrderMethod
  }: RecipesFilteredPage) {
    if (this.items !== null) {
      this.items.push(...items)
    } else {
      this.items = [...items]
    }
    this.pagedItems[currentPage] = items
    this.fetching = false
    this.pagesTo = currentPage
    this.totalPages = totalPages
    this.totalCount = totalCount
    this.hasNext = hasNext
    this.search = search
    this.orderMethod = orderMethod
    this.filters = filters
    this.orderMethodOptions = orderMethodOptions
    this.filterOptions = filterOptions
    this.defaultOrderMethod = defaultOrderMethod
  }
}
