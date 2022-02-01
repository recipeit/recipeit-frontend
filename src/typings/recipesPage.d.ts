import { RecipeFilterGroup, RecipeSortingMethod } from '@/constants/filters'

type RecipeFilterKeyAsQueryParam = `filters.${Lowercase<RecipeFilterGroup>}`

export type RecipesPageFilters = {
  [key in RecipeFilterGroup]?: Array<string | number>
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
  orderMethod?: RecipeSortingMethod
}
