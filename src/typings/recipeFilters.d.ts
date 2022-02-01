import { RecipeCategoryGroup } from '@/typings/recipeCategories'

export type RecipeFilterGroup = RecipeCategoryGroup | 'Other' | 'Diet' | 'Allergens' | 'BaseProducts'

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
