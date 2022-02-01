import { ProductCategory } from '@/typings/productCategories'
import { RecipeFilterKeyAsQueryParam, RecipeFilters, RecipesFilteredPageQueryParams } from '@/typings/recipesPage'

export const parseFilters = (filters: RecipeFilters): { [key in RecipeFilterKeyAsQueryParam]?: string } => {
  const renamedFilters = {}
  if (typeof filters === 'object' && filters !== null) {
    Object.entries(filters).forEach(([group, value]) => {
      if (value?.length > 0) {
        renamedFilters[`filters.${group.toLowerCase()}`] = value.join(',')
      }
    })
  }
  return renamedFilters
}

export const fetchRecipesQueryParams = (
  orderMethod: string | null,
  filters: RecipeFilters,
  search: string | null
): RecipesFilteredPageQueryParams => {
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

export const queryParamsFromRouteQuery = (routeQuery: { [key: string]: string | Array<string> }): RecipesFilteredPageQueryParams => {
  if (routeQuery) {
    const result = Object.fromEntries(
      Object.entries(routeQuery).filter(([key]) => key === 'search' || key === 'orderMethod' || key.startsWith('filters.'))
    )

    return result
  }

  return null
}

export const STORAGE_TOKEN = 'token'
export const STORAGE_REFRESH_TOKEN = 'refreshToken'

export const PRODUCT_GROUP_ICONS: { [key in ProductCategory]: string } = {
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
  DairyAndMeatAlternatives: 'dairy-alternatives',
  DessertsAndSnacks: 'dessert',
  Beverages: 'beverages'
}

const copyrightYears = [...new Set([2021, new Date().getFullYear()])]
export const COPYRIGHT_TEXT = `© ${copyrightYears.join(' - ')}`
