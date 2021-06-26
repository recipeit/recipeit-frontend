export const units = [
  {
    groupKey: 'weight',
    groupValues: ['milligram', 'gram', 'kilogram', 'dekagram']
  },
  {
    groupKey: 'volume',
    groupValues: ['cup', 'milliliter', 'deciliter', 'liter', 'tablespoon', 'teaspoon']
  },
  {
    groupKey: 'other',
    groupValues: ['clove', 'piece', 'grain', 'package', 'pinch', 'handful', 'slice', 'breadslice', 'bunch']
  }
]

export const recipesSortingMethods = [
  'NameAscending',
  'NameDescending',
  'TimeAscending',
  'TimeDescending',
  'IngredientsCountAscending',
  'IngredientsCountDescending'
]
export const defaultRecipesSortingMethod = recipesSortingMethods[0]

export class RecipeList {
  constructor() {
    this.fetching = false
    this.fetchingPages = {}
    this.pagesTo = null
    this.items = null
    this.pagedItems = {}
    this.totalPages = null
    this.totalCount = null
    this.hasNext = null
    this.search = null
    this.filters = {}
    this.orderMethod = null
    this.filterOptions = null
    this.orderMethodOptions = null
    this.defaultOrderMethod = null
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
  }) {
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
  }) {
    if (this.items !== null) {
      this.items.push(...items)
    } else {
      this.items = [...items]
    }
    this.pagedItems[currentPage] = items
    this.fetching = fetching
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

export function parseFilters(filters) {
  let renamedFilters = {}
  if (typeof filters === 'object' && filters !== null) {
    Object.entries(filters).forEach(([group, value]) => {
      if (value && value.length > 0) {
        renamedFilters[`filters.${group.toLowerCase()}`] = value.join(',')
      }
    })
  }
  return renamedFilters
}

export function fetchRecipesQueryParams(orderMethod, filters, search) {
  const paramsWithNullItems = {
    // pageNumber: null,
    search: search,
    orderMethod: orderMethod,
    ...parseFilters(filters)
  }

  return Object.fromEntries(
    Object.entries(paramsWithNullItems)
      .filter(([, value]) => value !== null)
      .map(([key]) => [key, paramsWithNullItems[key]])
  )
}

export const STORAGE_TOKEN = 'token'
export const STORAGE_REFRESH_TOKEN = 'refreshToken'

export const PRODUCT_GROUP_ICONS = {
  Others: 'food',
  Dairy: 'dairy-2',
  Vegetables: 'vegetables',
  Fruits: 'food',
  BakingAndGrains: 'grains',
  Sweeteners: 'sweeteners-2',
  Spices: 'spices-2',
  Meats: 'meats',
  Fishes: 'fishes',
  Seafoods: 'seafoods',
  Oils: 'oils-2',
  Sauces: 'sauces',
  Legumes: 'legumes',
  Alcohol: 'alcohol',
  FoodAdditives: 'soup',
  Nuts: 'nuts',
  DairyAlternatives: 'dairy-alternatives',
  DessertsAndSnacks: 'dessert',
  Beverages: 'beverages'
}
