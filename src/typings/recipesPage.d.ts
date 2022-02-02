import { RecipeEntity } from '@/typings/entities'
import { RecipeFilterGroup, RecipeFilterOptions, RecipeSortingMethod, RecipeSortingOptions } from '@/typings/recipeFilters'

type Page<T> = {
  items: Array<T>
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  hasPrevious: boolean
  hasNext: bool
}

export type RecipeFilterKeyAsQueryParam = `filters.${Lowercase<RecipeFilterGroup>}`

export type RecipeFilters = {
  [key in RecipeFilterGroup]?: Array<string | number>
}

export type RecipesFilteredPageParams = {
  orderMethod?: RecipeSortingMethod
  filters?: RecipeFilters
  search?: string
}

export type RecipesFilteredPageQueryParams = {
  [key in RecipeFilterKeyAsQueryParam]?: string
} & {
  pageNumber?: number
  search?: string
  orderMethod?: RecipeSortingMethod
}

export type RecipesPageQueryParams = {
  pageNumber?: number
}

export type RecipesFilteredPage = Page<RecipeEntity> & {
  search: string
  orderMethod: RecipeSortingMethod
  filters: RecipeFilters
  orderMethodOptions: RecipeSortingOptions
  filterOptions: RecipeFilterOptions
  defaultOrderMethod: RecipeSortingMethod
}

export type RecipesPage = Page<RecipeEntity>
