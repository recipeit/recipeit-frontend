import { RECIPE_FILTER_GROUPS, RECIPE_SORTING_METHODS } from '@/constants/filters'

type RecipeFilterKey = typeof RECIPE_FILTER_GROUPS[keyof typeof RECIPE_FILTER_GROUPS]
type RecipeFilterKeyAsQueryParam = `filters.${Lowercase<RecipeFilterKey>}`

export type RecipeSortingMethod = typeof RECIPE_SORTING_METHODS[keyof typeof RECIPE_SORTING_METHODS]

export type RecipesPageFilters = {
  [key in RecipeFilterKey]?: Array<string | number>
}

export type RecipesPageParams = {
  orderMethod?: RecipeSortingMethod
  filters?: RecipesPageFilters
  search?: string
}

export type RecipesPageQueryParams = {
  [key in RecipeFilterKeyAsQueryParam]?: string
} & {
  pageNumber?: number
  search?: string
  orderMethod?: string
}
