import { RecipeCategoryGroup } from '@/typings/recipeCategories'

export type RecipeFilterGroup = RecipeCategoryGroup | 'Other' | 'Diet' | 'Allergens' | 'BaseProducts'

export type RecipeFilterOptions = {
  [key in RecipeFilterGroup]: {
    inputType: 'Checkbox' | 'Radio'
    isCategoryFilter: boolean
    name: string
    options: Array<{ key: number; value: string }>
    type: 'Any' | 'All' | 'None'
  }
}

export type RecipeSortingMethod =
  | 'Newest'
  | 'NameAscending'
  | 'NameDescending'
  | 'TimePreparingAscending'
  | 'TimePreparingDescending'
  | 'IngredientsCountAscending'
  | 'IngredientsCountDescending'
  | 'MissingIngredientsAscending'
  | 'MissingIngredientsDescending'

export type RecipeSortingOptions = Array<RecipeSortingMethod>
