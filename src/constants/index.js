export const units = [
  'Weight.Gram',
  'Weight.Kilogram',
  'Volume.Liter',
  'Volume.Milliliter',
  'Volume.Tablespoon',
  'Volume.Teaspoon',
  'Whole.Piece',
  'Whole.Grain',
  'Whole.Handful'
]

export const unitTranslations = {
  'Weight.Gram': 'g',
  'Weight.Kilogram': 'kg',
  'Volume.Liter': 'l',
  'Volume.Milliliter': 'ml',
  'Volume.Tablespoon': 'łyżka',
  'Volume.Teaspoon': 'łyżeczka',
  'Whole.Piece': 'szt.',
  'Whole.Grain': 'ziarna',
  'Whole.Handful': 'garść'
}

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
    this.pagesTo = null
    this.items = null
    this.totalPages = null
    this.totalCount = null
    this.hasNext = null
    this.filters = {}
    this.orderMethod = null
  }

  setFromApi({ fetching, recipes, currentPage, totalPages, totalCount, hasNext, orderMethod, filters }) {
    this.fetching = fetching
    this.items = recipes
    this.pagesTo = currentPage
    this.totalPages = totalPages
    this.totalCount = totalCount
    this.hasNext = hasNext
    this.orderMethod = orderMethod
    this.filters = filters
  }

  addFromApi({ fetching, recipes, currentPage, totalPages, totalCount, hasNext, orderMethod, filters }) {
    if (this.items !== null) {
      this.items.push(...recipes)
    } else {
      this.items = recipes
    }
    this.fetching = fetching
    this.pagesTo = currentPage
    this.totalPages = totalPages
    this.totalCount = totalCount
    this.hasNext = hasNext
    this.orderMethod = orderMethod
    this.filters = filters
  }
}

export function parseFilters(filters) {
  let renamedFilters = {}
  if (typeof filters === 'object' && filters !== null) {
    Object.keys(filters).forEach(group => {
      if (filters[group] && filters[group].length > 0) {
        renamedFilters[`filters.${group}`] = filters[group].join(',')
      }
    })
  }
  return renamedFilters
}

export function fetchRecipesQueryParams(orderMethod, filters) {
  return {
    pageNumber: null,
    orderMethod: orderMethod,
    ...parseFilters(filters)
  }
}
